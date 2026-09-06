
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface Props {
  search: string;
}

export const ProductEmptyState = ({
  search,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        No products found
      </Text>

      {search ? (
        <Text style={styles.message}>
          No products match "{search}"
        </Text>
      ) : (
        <Text style={styles.message}>
          There are no products yet.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  message: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
});