import 'package:flutter/material.dart';
import 'Screens/authPage.dart'; // ✅ Import your auth page

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MomzFoodz',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      debugShowCheckedModeBanner: false,
      home: AuthenticationPage(), // ✅ Start with the auth page
    );
  }
}
