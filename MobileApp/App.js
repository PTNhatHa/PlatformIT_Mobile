import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { SigninSignup } from './src/navigation/SigninSignup';
import { UserProvider } from './src/contexts/UserContext';
import { ModalCourseContent } from './src/components/ModalCourseContent';
import { StudentLectureDetail } from './src/screens/Student/TabMyCourse/StudentLectureDetail';
import { Comments } from './src/components/Comments';
import { TeacherLectureDetail } from './src/screens/Teacher/TabMyCourse/TeacherLectureDetail';
import { TeacherLectureCreate } from './src/screens/Teacher/TabMyCourse/TeacherLectureCreate';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserProvider>
          {/* <SigninSignup/> */}
          <TeacherLectureCreate/>
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
    
  );
}