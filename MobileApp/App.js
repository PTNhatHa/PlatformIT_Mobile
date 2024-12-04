import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { SigninSignup } from './src/navigation/SigninSignup';
import { UserProvider } from './src/contexts/UserContext';
import { ModalCourseContent } from './src/components/ModalCourseContent';
import { StudentLectureDetail } from './src/screens/Student/TabMyCourse/StudentLectureDetail';
import { Comments } from './src/components/Comments';
import { TeacherLectureDetail } from './src/screens/Teacher/TabMyCourse/TeacherLectureDetail';
import { TeacherLectureCreate } from './src/screens/Teacher/TabMyCourse/TeacherLectureCreate';
import { TeacherAllAssignment } from './src/screens/Teacher/TabMyAssignment/TeacherAllAssignment';
import { TeacherAsgmCreate } from './src/screens/Teacher/TabMyAssignment/TeacherAsgmCreate';
import SigninGg from './src/components/SigninGg';
import { DetailTeacher } from './src/screens/DetailTeacher';
import { CardAssignment } from './src/components/CardAssignment';
import { FilterAsgm } from './src/components/Filter';
import { CustomSwitch } from './src/components/CustomSwitch';
import { SelectCourseBox } from './src/components/TextInputField';
import { StudentDetailAsgm } from './src/screens/Student/TabMyTest/StudentDetailAsgm';
import { AttendanceIndicator } from './src/components/SubmittedCircle';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserProvider>
          <SigninSignup/>
          {/* <StudentLectureDetail/> */}
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
    
  );
}