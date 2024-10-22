import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { SigninSignup } from './src/navigation/SigninSignup';
import { UserProvider } from './src/contexts/UserContext';
import { CardVirticalAssignment, CardVirticalCenter, CardVirticalCourse, CardVirticalTeacher } from './src/components/CardVertical';
import { TeacherHome } from './src/screens/Teacher/TabHome/TeacherHome';
import { FilterCourse, TeacherViewAll, ViewAll, ViewAllCenter, ViewAllCourse, ViewAllTeacher } from './src/screens/ViewAll';
import { TeacherPI } from './src/screens/Teacher/TabAccount/TeacherPI';
import { SocialLink } from './src/components/SocialLink';
import { ForgotPassword } from './src/screens/SignIn';
import { Professional } from './src/components/Professional';
import { DetailCourse } from './src/screens/DetailCourse';
import { CardLecture } from './src/components/CardLecture';
import { CardAssignmentStudent } from './src/components/CardAssignment';
import { DetailTeacher } from './src/screens/DetailTeacher';
import { StudentHome } from './src/screens/Student/TabHome/StudentHome';
import { DateTimePickerComponent } from './src/components/DateTimePicker';
import { StudentAllCourse } from './src/screens/Student/TabMyCourse/StudentAllCourse';
import { TextInputLabel } from './src/components/TextInputField';
import { PersionalInfor } from './src/components/PI';
import { StudentPI } from './src/screens/Student/TabAccount/StudentPI';
import { SpecialPI } from './src/components/SpecialPI';
import { DetailCenter } from './src/screens/DetailCenter';
import { TeacherDetailCourse } from './src/screens/Teacher/TabMyCourse/TeacherDetailCourse';
import { StudentDetailCourse } from './src/screens/Student/TabMyCourse/StudentDetailCourse';
import { TeacherDetailAttendance } from './src/screens/Teacher/TabMyCourse/TeacherDetailAttendance';
import { CardProgress } from './src/components/CardProgress';
import { CardNoti } from './src/components/CardNotification';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserProvider>
          <SigninSignup/>
          {/* <CardNoti/> */}
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
    
  );
}