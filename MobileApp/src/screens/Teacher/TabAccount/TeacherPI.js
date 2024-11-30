import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PersionalInfor } from "../../../components/PI";
import { useState, useEffect } from "react";
import { getUserInfo } from "../../../services/user";
import { useUser } from "../../../contexts/UserContext";
import { COLORS } from '../../../utils/constants';
import { TouchableOpacity } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ChangePassword } from '../../../components/ChangePassword';
import { SpecialPI } from '../../../components/SpecialPI';
import { SocialLink } from '../../../components/SocialLink';
import { Professional } from '../../../components/Professional';

export const TeacherPI = ({route}) => {
    const isNoti = route?.params?.idNotification || false
    const { state, dispatch } = useUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [indexTab, setIndexTab] = useState(isNoti ? 3 : 1)
    const [refreshing, setRefreshing] = useState(false)

    const fetchData = async () => {
        try {
            const response = await getUserInfo(state.idUser);
            setData(response);
        } catch (error) {
            console.error("Error fetching user info: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [state.idUser]);

    if (loading) {
        // Render màn hình chờ khi dữ liệu đang được tải
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.main} />
            </View>
        );
    }

    const handleRefresh = async ()=>{
        setRefreshing(true)
        try {
            await fetchData()
        } catch (error) {
            console.log("Error refresh");
        } finally{
            setRefreshing(false)
        }
    }
    return (
        <ScrollView 
            contentContainerStyle={styles.wrapPI}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}    
        >
            <View style={styles.tabBar}>
                <TouchableOpacity style={[styles.wraptab, {backgroundColor: indexTab === 1 ? COLORS.main30 : COLORS.lightText}]} onPress={()=>setIndexTab(1)}>
                    <FontAwesome5 name="user-alt" size={18} color={COLORS.main} />
                    {indexTab === 1 &&
                        <Text style={styles.tab}>Personal Infomation</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={[styles.wraptab, {backgroundColor: indexTab === 3 ? COLORS.main30 : COLORS.lightText}]} onPress={()=>setIndexTab(3)}>
                <Ionicons name="school" size={18} color={COLORS.main} />
                    {indexTab === 3 &&
                        <Text style={styles.tab}>Specialized Infomation</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={[styles.wraptab, {backgroundColor: indexTab === 2 ? COLORS.main30 : COLORS.lightText}]} onPress={()=>setIndexTab(2)}>
                <MaterialIcons name="security" size={18} color={COLORS.main} />
                    {indexTab === 2 &&
                        <Text style={styles.tab}>Security</Text>
                    }
                </TouchableOpacity>
            </View>
            <>
                {indexTab === 1 &&
                    <PersionalInfor info={data} />
                }
                {indexTab === 2 &&
                    <ChangePassword/>
                }
                {indexTab === 3 &&
                    <View style={styles.wrap3}>
                        <SpecialPI initData={data} fetchData={fetchData}/>
                        <SocialLink value={data.links} fetchData={fetchData}/>
                        <Professional value={data.qualificationModels} fetchData={fetchData}/>
                    </View>
                }
            </>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    wrapPI: {
        padding: 16,
        rowGap: 20
    },
    tabBar: {
        flexDirection: "row",
        columnGap: 8,
    },
    wraptab: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 8,
        paddingHorizontal: 16,
        alignSelf: "flex-start",
        borderRadius: 8,
        height: 40,
    },
    tab: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.main
    },
    wrap3: {
        rowGap: 30
    }
})