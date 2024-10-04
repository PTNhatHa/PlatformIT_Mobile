import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { SigninSignup } from './src/navigation/SigninSignup';
import { UserProvider } from './src/contexts/UserContext';
import { CardVirticalAssignment, CardVirticalCenter, CardVirticalCourse, CardVirticalTeacher } from './src/components/CardVertical';
import { TeacherHome } from './src/screens/Teacher/TabHome/TeacherHome';
import { ViewAll, ViewAllCenter, ViewAllCourse, ViewAllTeacher } from './src/screens/ViewAll';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserProvider>
          <SigninSignup/>
          {/* <TeacherHome/> */}
          {/* <ViewAll/> */}
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
    
  );
}