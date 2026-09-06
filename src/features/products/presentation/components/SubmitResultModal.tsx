import { Button } from "@/shared/components/Button";
import { Modal, Text, View } from "react-native";

interface Props {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

export const SubmitResultModal = ({
  visible,
  type,
  title,
  message,
  onClose,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View>
        <View>
          <Text>{title}</Text>

          <Text>{message}</Text>

          <Button
            title="Đóng"
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};