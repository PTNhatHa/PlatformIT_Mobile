import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { SigninSignup } from './src/navigation/SigninSignup';
import { UserProvider } from './src/contexts/UserContext';
import { ModalCourseContent } from './src/components/ModalCourseContent';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserProvider>
          <SigninSignup/>
          {/* <ModalCourseContent/> */}
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
    
  );
}