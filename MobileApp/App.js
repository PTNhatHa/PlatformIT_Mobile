import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { SigninSignup } from './src/navigation/SigninSignup';
import { UserProvider } from './src/contexts/UserContext';
import { CardNoti } from './src/components/CardNotification';
import { NotificationScreen } from './src/screens/Notification';
import { Progress, ProgressCircle } from './src/components/Progress';
import { FilterCenter, FilterCourse, FilterTeacher } from './src/components/Filter';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserProvider>
          {/* <SigninSignup/> */}
          <FilterCourse/>
          {/* <FilterTeacher/> */}
          {/* <FilterCenter/> */}
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
    
  );
}