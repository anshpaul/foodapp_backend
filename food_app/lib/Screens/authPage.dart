import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:food_app/Screens/admin/adminDashboard.dart';
import 'package:http/http.dart' as http;

import 'package:shared_preferences/shared_preferences.dart';

import '../dashboard.dart';

class AuthenticationPage extends StatefulWidget {
  @override
  State<AuthenticationPage> createState() => _AuthenticationPageState();
}

class _AuthenticationPageState extends State<AuthenticationPage> {
  bool isLogin = true;
  final nameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final passCtrl = TextEditingController();
  bool rememberMe = false;
  bool obscure = true;
  bool checkingLogin = true; // <-- New state for loading

  @override
  void initState() {
    super.initState();
    _checkIfLoggedIn();
  }

  Future<void> _checkIfLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('authToken');
    final role = prefs.getString('userRole');

    if (token != null && role != null && mounted) {
      await Future.delayed(const Duration(milliseconds: 300));
      _navigateToHomePage(role);
    } else {
      setState(() => checkingLogin = false);
    }
  }

  Future<void> authAction() async {
    if (isLogin) {
      if (emailCtrl.text.isEmpty || passCtrl.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill in all fields')),
        );
        return;
      }
    } else {
      if (nameCtrl.text.isEmpty ||
          emailCtrl.text.isEmpty ||
          passCtrl.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill in all fields')),
        );
        return;
      }
    }

    try {
      final url = isLogin
          ? "https://foodapp-backend-1snw.onrender.com/api/auth/login"
          : "https://foodapp-backend-1snw.onrender.com/api/auth/register";

      final body = isLogin
          ? {"email": emailCtrl.text, "password": passCtrl.text}
          : {
              "name": nameCtrl.text,
              "email": emailCtrl.text,
              "password": passCtrl.text,
              "role": "user",
            };

      final response = await http
          .post(
            Uri.parse(url),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 30));

      final res = jsonDecode(response.body);

      if (response.statusCode == 200 && res["success"] == true) {
        final token = res["token"] ?? '';
        final role = res["role"] ?? 'user';

        final prefs = await SharedPreferences.getInstance();
        await prefs.remove('authToken');
        await prefs.remove('userRole');

        if (token.isNotEmpty && rememberMe) {
          await prefs.setString('authToken', token);
          await prefs.setString('userRole', role);
        }

        if (!mounted) return;
        _navigateToHomePage(role);
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(res["error"] ?? "Authentication failed")),
        );
      }
    } on http.ClientException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Network error: ${e.message}")));
    } on TimeoutException {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Request timed out")));
    } on FormatException {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Invalid server response")));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("An error occurred: ${e.toString()}")),
      );
    }
  }

  void _navigateToHomePage(String role) {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => role == "admin" ? AdminDashboard() : Dashboard(),
      ),
    );
  }

  Widget customTextField({
    required String hint,
    required TextEditingController controller,
    bool isPassword = false,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextFormField(
      keyboardType: keyboardType,
      controller: controller,
      obscureText: isPassword ? obscure : false,
      style: const TextStyle(
        fontFamily: 'Heebo',
        fontSize: 16,
        color: Colors.black,
      ),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(fontFamily: 'Lato', color: Colors.black),
        filled: true,
        fillColor: const Color(0xFFF0FFF1),
        suffixIcon: isPassword
            ? IconButton(
                icon: Icon(
                  obscure ? Icons.visibility_off : Icons.visibility,
                  color: Colors.black,
                ),
                onPressed: () => setState(() => obscure = !obscure),
              )
            : null,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Colors.purpleAccent),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Colors.purpleAccent),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (checkingLogin) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final custHeight = MediaQuery.of(context).size.height;
    final custWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: const Color(0xFF12012B),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFFf0fff1),
              borderRadius: BorderRadius.circular(30),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Image.asset(
                  'assets/login logo .png',
                  height: custHeight / 8,
                  width: custWidth * 0.6,
                  fit: BoxFit.contain,
                ),
                const SizedBox(height: 20),
                Text(
                  isLogin ? "Login to your account" : "Register your account",
                  style: const TextStyle(
                    fontFamily: 'Englebert',
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF47126b),
                  ),
                ),
                const SizedBox(height: 30),
                if (!isLogin) ...[
                  customTextField(
                    hint: "Enter your name",
                    controller: nameCtrl,
                    keyboardType: TextInputType.name,
                  ),
                  const SizedBox(height: 15),
                ],
                customTextField(
                  hint: "Your email",
                  controller: emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 15),
                customTextField(
                  hint: "Enter your password",
                  controller: passCtrl,
                  isPassword: true,
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Checkbox(
                      value: rememberMe,
                      activeColor: const Color(0xFF47126b),
                      onChanged: (val) => setState(() => rememberMe = val!),
                    ),
                    const Text(
                      "Remember me",
                      style: TextStyle(
                        fontFamily: 'Lato',
                        color: Color(0xFF47126b),
                      ),
                    ),
                    const Spacer(),
                    if (isLogin)
                      TextButton(
                        onPressed: () {},
                        child: const Text(
                          "Forgot password?",
                          style: TextStyle(
                            fontFamily: "Lato",
                            color: Color(0xFF47126b),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 10),
                Container(
                  width: double.infinity,
                  height: 50,
                  decoration: BoxDecoration(
                    color: const Color(0xFF47126b),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: ElevatedButton(
                    onPressed: authAction,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                    ),
                    child: Text(
                      isLogin ? "Log in" : "Register",
                      style: const TextStyle(
                        fontFamily: 'Englebert',
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                        fontSize: 18,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                TextButton(
                  onPressed: () => setState(() => isLogin = !isLogin),
                  child: RichText(
                    text: TextSpan(
                      style: const TextStyle(
                        fontFamily: 'Lato',
                        color: Colors.purple,
                      ),
                      children: [
                        TextSpan(
                          text: isLogin
                              ? "Don’t have an account? "
                              : "Already have an account? ",
                        ),
                        TextSpan(
                          text: isLogin ? " Create an account" : " Login",
                          style: const TextStyle(
                            color: Color(0xFF47126b),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
