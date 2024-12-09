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
import { FilterAsgm, FilterStudentOverview, FilterStudentProgress } from './src/components/Filter';
import { CustomSwitch } from './src/components/CustomSwitch';
import { SelectCourseBox } from './src/components/TextInputField';
import { StudentDetailAsgm } from './src/screens/Student/TabMyTest/StudentDetailAsgm';
import { SubmittedCircle } from './src/components/SubmittedCircle';
import { COLORS } from './src/utils/constants';
import { TeacherDetailAsgm } from './src/screens/Teacher/TabMyAssignment/TeacherDetailAsgm';
import { CardStudentAttendance, CardStudentDetailAsgm } from './src/components/CardStudent';

const data = [
  { label: 'On Time', value: 25, color: COLORS.green }, // Xanh lá
  { label: 'Late', value: 0, color: COLORS.yellow }, // Vàng
  { label: 'Not Submitted', value: 30, color: COLORS.lightText }, // Đỏ
];

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserProvider>
          <SigninSignup/>
          {/* <FilterStudentProgress/> */}
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
    
  );
}