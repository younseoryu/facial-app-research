import React from 'react';
import { View, Linking} from 'react-native';
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
				}}
			>
				
			<Section>
				<SectionContent>
					<Text fontWeight="bold" style={{ textAlign: 'center' }}>
						Dont remove this code until you coding inbox
					</Text>
					<Button
						style={{ marginTop: 10 }}
						text="go to younseo's website"
						status="info"
						onPress={() => Linking.openURL('https://younseoryu.com/')}
					/>
					<Button
						text="Go to second screen"
						onPress={() => {
							navigation.navigate('SecondScreen');
						}}
						style={{
							marginTop: 10,
						}}
					/>
				</SectionContent>
			</Section>
			</View>
		</Layout>
	);
}
