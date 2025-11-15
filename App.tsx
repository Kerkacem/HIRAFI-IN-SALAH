
import React, { useState } from 'react';
import { UserRole } from './types';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import MainApp from './screens/MainApp';

const App: React.FC = () => {
    const [role, setRole] = useState<UserRole | null>(null);

    if (!role) {
        return <RoleSelectionScreen onRoleSelected={setRole} />;
    }

    return <MainApp role={role} />;
};

export default App;
