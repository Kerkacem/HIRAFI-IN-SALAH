import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, ServiceRequest, Review, RequestStatus, Artisan } from '../types';
import { CATEGORIES } from '../constants';
import * as api from '../services/googleSheetApi';
import BottomNavBar from '../components/BottomNavBar';
import ClientHomeScreen from './client/ClientHomeScreen';
import RequestsScreen from './client/RequestsScreen';
import ArtisansListScreen from './client/ArtisansListScreen';
import ClientProfileScreen from './client/ClientProfileScreen';
import RequestServiceScreen from './client/RequestServiceScreen';
import ArtisanHomeScreen from './artisan/ArtisanHomeScreen';
import ArtisanRequestsScreen from './artisan/ArtisanRequestsScreen';
import ArtisanProfileScreen from './artisan/ArtisanProfileScreen';
import ArtisanDetailScreen from './client/ArtisanDetailScreen';
import AIChatScreen from './client/AIChatScreen';
import { IconBuild } from '../components/icons';

interface MainAppProps {
    role: UserRole;
}

const CURRENT_ARTISAN = { id: "2", skill: "سباكة / ماء" }; // Simplified for demo logic

const MainApp: React.FC<MainAppProps> = ({ role }) => {
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [fetchedArtisans, fetchedReviews, fetchedRequests] = await Promise.all([
                    api.getArtisans(),
                    api.getReviews(),
                    api.getRequests(),
                ]);
                setArtisans(fetchedArtisans);
                setReviews(fetchedReviews);
                setRequests(fetchedRequests);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("فشل تحميل البيانات من Google Sheet. تأكد من أن الرابط صحيح وأن الشيت متاح للعامة.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRequestCreated = async (req: ServiceRequest) => {
        setRequests(prev => [...prev, req]); // Optimistic update
        try {
            await api.addRequest(req);
        } catch (error) {
            console.error("Failed to add request:", error);
            // Optionally revert state or show error
        }
    };

    const handleUpdateRequestStatus = async (requestId: string, status: RequestStatus) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r)); // Optimistic
        try {
            await api.updateRequest({ requestId, status });
        } catch (error) {
            console.error("Failed to update request status:", error);
        }
    };

    const handleAddReview = async (review: Review, requestId: string) => {
        setReviews(prev => [...prev, review]); // Optimistic
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, reviewId: review.id, status: RequestStatus.Done } : r)); // Optimistic
        try {
            await Promise.all([
                api.addReview(review),
                api.updateRequest({ requestId, reviewId: review.id, status: RequestStatus.Done })
            ]);
        } catch (error) {
            console.error("Failed to add review:", error);
        }
    };

    const artisanRatings = useMemo(() => {
        const ratings: { [key: string]: { totalRating: number; count: number } } = {};
        reviews.forEach(review => {
            if (!ratings[review.artisanId]) {
                ratings[review.artisanId] = { totalRating: 0, count: 0 };
            }
            ratings[review.artisanId].totalRating += review.rating;
            ratings[review.artisanId].count += 1;
        });

        const averages: { [key: string]: { averageRating: number; reviewCount: number } } = {};
        for (const artisanId in ratings) {
            averages[artisanId] = {
                averageRating: ratings[artisanId].totalRating / ratings[artisanId].count,
                reviewCount: ratings[artisanId].count
            };
        }
        return averages;
    }, [reviews]);

    const artisansWithRatings = useMemo(() => {
        return artisans.map(artisan => {
            const ratingInfo = artisanRatings[artisan.id] || { averageRating: 0, reviewCount: 0 };
            return { ...artisan, ...ratingInfo };
        });
    }, [artisans, artisanRatings]);


    const artisanRequests = useMemo(() => {
        if (role === UserRole.ARTISAN) {
            return requests.filter(req => req.categoryName === CURRENT_ARTISAN.skill).reverse();
        }
        return [];
    }, [requests, role]);

    const newArtisanRequestsCount = useMemo(() => {
        if (role === UserRole.ARTISAN) {
            return artisanRequests.filter(req => !req.viewedByArtisans.includes(CURRENT_ARTISAN.id)).length;
        }
        return 0;
    }, [artisanRequests, role]);

    const markArtisanRequestsAsViewed = () => {
        // This is a local state update, for a real app this should be persisted.
        setRequests(prevRequests =>
            prevRequests.map(req => {
                const isRelevantRequest = req.categoryName === CURRENT_ARTISAN.skill;
                const isAlreadyViewed = req.viewedByArtisans.includes(CURRENT_ARTISAN.id);
                
                if (isRelevantRequest && !isAlreadyViewed) {
                    return {
                        ...req,
                        viewedByArtisans: [...req.viewedByArtisans, CURRENT_ARTISAN.id]
                    };
                }
                return req;
            })
        );
    };
    
    if (isLoading) {
        return (
            <div className="flex flex-col h-screen justify-center items-center text-center bg-brand-background">
                <IconBuild className="w-16 h-16 text-brand-primary animate-spin" />
                <h1 className="text-xl font-bold text-brand-primary mt-4">جاري تحميل البيانات...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen justify-center items-center text-center bg-red-50 p-4">
                <h1 className="text-xl font-bold text-red-600">خطأ في الاتصال</h1>
                <p className="text-red-500 mt-2">{error}</p>
            </div>
        )
    }

    return (
        <HashRouter>
            <div className="relative min-h-screen bg-brand-background pb-20">
                <main className="h-full">
                    <Routes>
                        <Route
                            path="/"
                            element={role === UserRole.CLIENT
                                ? <ClientHomeScreen artisans={artisansWithRatings} categories={CATEGORIES} />
                                : <ArtisanHomeScreen requests={artisanRequests} artisans={artisansWithRatings} />
                            }
                        />
                        <Route
                            path="/requests"
                            element={role === UserRole.CLIENT
                                ? <RequestsScreen 
                                    requests={requests} 
                                    onUpdateRequestStatus={handleUpdateRequestStatus}
                                    onAddReview={handleAddReview}
                                  />
                                : <ArtisanRequestsScreen requests={artisanRequests} onView={markArtisanRequestsAsViewed} />
                            }
                        />
                        <Route
                            path="/artisans"
                            element={<ArtisansListScreen artisans={artisansWithRatings} />}
                        />
                         <Route
                            path="/artisans/:id"
                            element={<ArtisanDetailScreen artisans={artisansWithRatings} reviews={reviews} />}
                        />
                        <Route
                            path="/profile"
                            element={role === UserRole.CLIENT
                                ? <ClientProfileScreen />
                                : <ArtisanProfileScreen />
                            }
                        />
                        {role === UserRole.CLIENT && (
                           <>
                             <Route
                                path="/request-service"
                                element={<RequestServiceScreen categories={CATEGORIES} onRequestCreated={handleRequestCreated} />}
                            />
                            <Route
                                path="/ai-chat"
                                element={<AIChatScreen />}
                            />
                           </>
                        )}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <BottomNavBar role={role} badgeCount={newArtisanRequestsCount} />
            </div>
        </HashRouter>
    );
};

export default MainApp;
