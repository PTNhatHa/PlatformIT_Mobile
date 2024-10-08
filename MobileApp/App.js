import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { SigninSignup } from './src/navigation/SigninSignup';
import { UserProvider } from './src/contexts/UserContext';
import { CardVirticalAssignment, CardVirticalCenter, CardVirticalCourse, CardVirticalTeacher } from './src/components/CardVertical';
import { TeacherHome } from './src/screens/Teacher/TabHome/TeacherHome';
import { ViewAll, ViewAllCenter, ViewAllCourse, ViewAllTeacher } from './src/screens/ViewAll';
import { TeacherPI } from './src/screens/Teacher/TabAccount/TeacherPI';
import { SocialLink } from './src/components/SocialLink';
import { ForgotPassword } from './src/screens/SignIn';
import { Professional } from './src/components/Professional';

const initCourse=[
  {
      id: 1,
      img: "",
      title: "Title1",
      listTags: [
          { id: 1, value: "Web developer"},
          { id: 2, value: "Backend"},
          { id: 3, value: "Frontend"},
      ],
      startCourse: new Date(),
      endCourse: new Date(),
      startRegist: new Date(),
      endRegist: new Date(),
      isRegist: true,
      cost: 120,
      costSale: 100
  },
  {
      id: 2,
      img: "",
      title: "Title2",
      listTags: [
          { id: 2, value: "Backend"},
          { id: 3, value: "Frontend"},
      ],
      startCourse: new Date(),
      endCourse: new Date(),
      startRegist: new Date(),
      endRegist: new Date(),
      isRegist: false,
      cost: 120,
      costSale: 100
  },
  {
      id: 3,
      img: "",
      title: "Title3",
      listTags: [
          { id: 3, value: "Frontend"},
      ],
      startCourse: new Date(),
      endCourse: new Date(),
      isRegist: true,
      cost: 120,
      costSale: 100
  },
  {
      id: 4,
      img: "",
      title: "Title4",
      listTags: [
          { id: 1, value: "Web developer"},
          { id: 2, value: "Backend"},
          { id: 3, value: "Frontend"},
      ],
      startCourse: new Date(),
      endCourse: new Date(),
      startRegist: new Date(),
      endRegist: new Date(),
      isRegist: true,
      cost: 120,
      costSale: 100
  },
  {
      id: 5,
      img: "",
      title: "Title5",
      listTags: [
          { id: 2, value: "Backend"},
          { id: 3, value: "Frontend"},
      ],
      startCourse: new Date(),
      endCourse: new Date(),
      startRegist: new Date(),
      endRegist: new Date(),
      isRegist: false,
      cost: 120,
      costSale: 100
  },
  {
      id: 6,
      img: "",
      title: "Title6",
      listTags: [
          { id: 3, value: "Frontend"},
      ],
      startCourse: new Date(),
      endCourse: new Date(),
      isRegist: true,
      cost: 120,
      costSale: 100
  },
]

const initCenter=[
  {
      id: 1,
      img: "",
      title: "Center",
      listTags: [
          { id: 1, value: "Web developer"},
          { id: 2, value: "Backend"},
          { id: 3, value: "Frontend"},
      ],
  },
  {
      id: 2,
      img: "",
      title: "Center",
      listTags: [
          { id: 2, value: "Backend"},
          { id: 3, value: "Frontend"},
      ],
  },
  {
      id: 3,
      img: "",
      title: "Center",
      listTags: [
          { id: 3, value: "Frontend"},
      ],
  },
]

const initTeacher=[
  {
      id: 1,
      img: "",
      name: "Nhatha",
      description: "Description"
  },
  {
      id: 2,
      img: "",
      name: "Taho",
      description: "Description"
  },
  {
      id: 3,
      img: "",
      name: "Hyy",
      description: "Description"
  },
]
const initAssignment = [
  {
      id: 1,
      title: "Title",
      img: "",
      nameCourse: "OOP",
      due: new Date(),
      duration: 45,
      type: "Test",
      isPublish: true,
      submitted: 0.8
  },
  {
      id: 2,
      title: "Title",
      img: "",
      nameCourse: "OOP",
      due: new Date(),
      duration: 45,
      type: "Test",
      isPublish: false,
      submitted: 0
  },
  {
      id: 3,
      title: "Title",
      img: "",
      nameCourse: "OOP",
      due: new Date(),
      duration: null,
      type: "Exercise",
      isPublish: true,
      submitted: 0.9
  },
]
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserProvider>
          {/* <SigninSignup/> */}
          {/* <TeacherHome/> */}
          <ViewAll initCourse={initCourse} initCenter={initCenter} initTeacher={initTeacher}/>
          {/* <TeacherPI/> */}
          {/* <ForgotPassword/> */}
          {/* <Professional/> */}
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
    
  );
}