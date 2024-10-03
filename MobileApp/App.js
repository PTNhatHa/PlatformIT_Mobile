import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import { NavigationContainer } from '@react-navigation/native';
import { SigninSignup } from './src/navigation/SigninSignup';
import { StudentBottomTab, TeacherBottomTab } from './src/navigation/StudentBottomTab';
import { TextInputLabel } from './src/components/TextInputField';
import { PersionalInfor } from './src/components/PI';
import { ComboBox } from './src/components/ComboBox';
import { TeacherPI } from './src/screens/Teacher/TeacherPI';
import { Professional } from './src/components/Professional';
import { Account } from './src/screens/Student/TabAccount/Account';
import { UserProvider } from './src/contexts/UserContext';
import { ChangePassword } from './src/screens/ChangePassword';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserProvider>
          <SigninSignup/>
          {/* <Account/> */}
          {/* <ChangePassword/> */}
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
    
  );
}