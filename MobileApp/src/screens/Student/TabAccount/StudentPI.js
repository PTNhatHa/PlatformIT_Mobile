import { ActivityIndicator, View } from 'react-native';
import { PersionalInfor } from "../../../components/PI";
import { useState, useEffect } from "react";
import { getUserInfo } from "../../../services/user";
import { useUser } from "../../../contexts/UserContext";
import { COLORS } from '../../../utils/constants';

export const StudentPI = ({ navigation }) => {
    const { state, dispatch } = useUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    return (
        <PersionalInfor navigation={navigation} info={data} />
    );
};
