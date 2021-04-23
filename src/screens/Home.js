import React from 'react';
import { View, Linking } from 'react-native';
import * as firebase from 'firebase';
import {
	Layout,
	Button,
	Text,
	TopNav,
	Section,
	SectionContent,
} from 'react-native-rapi-ui';

export default function ({ navigation }) {
	return (
		<Layout>
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					marginHorizontal: 20,
				}}
			>
			<Text>Home Tab</Text>
			</View>
		</Layout>
	);
}
