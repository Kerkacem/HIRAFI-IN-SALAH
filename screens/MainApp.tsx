import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, ServiceRequest, Review, RequestStatus } from '../types';
import { CATEGORIES, DEMO_ARTISANS, DEMO_REVIEWS } from '../constants';
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

interface MainAppProps {
    role: UserRole;
}

// Simulate a logged-in artisan. In a real app, this would come from an auth context.
const CURRENT_ARTISAN = DEMO_ARTISANS[1]; // Ahmed Qadri, the plumber

const MainApp: React.FC<MainAppProps> = ({ role }) => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [reviews, setReviews] = useState<Review[]>(DEMO_REVIEWS);

    const handleRequestCreated = (req: ServiceRequest) => {
        setRequests(prev => [...prev, req]);
    };

    const handleUpdateRequestStatus = (requestId: string, status: RequestStatus) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
    };

    const handleAddReview = (review: Review, requestId: string) => {
        setReviews(prev => [...prev, review]);
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, reviewId: review.id } : r));
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
        return DEMO_ARTISANS.map(artisan => {
            const ratingInfo = artisanRatings[artisan.id] || { averageRating: 0, reviewCount: 0 };
            return { ...artisan, ...ratingInfo };
        });
    }, [artisanRatings]);


    const artisanRequests = useMemo(() => {
        if (role === UserRole.ARTISAN) {
            // Newest requests first
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

    return (
        <HashRouter>
            <div className="relative min-h-screen bg-brand-background pb-20">
                <main className="h-full">
                    <Routes>
                        <Route
                            path="/home"
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
                            <Route
                                path="/request-service"
                                element={<RequestServiceScreen categories={CATEGORIES} onRequestCreated={handleRequestCreated} />}
                            />
                        )}
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                </main>
                <BottomNavBar role={role} badgeCount={newArtisanRequestsCount} />
            </div>
        </HashRouter>
    );
};

export default MainApp;