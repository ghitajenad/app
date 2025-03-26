<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    // 🔹 Inscription d'un utilisateur
    public function register(Request $request)
    {
        // Validation des données reçues
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'firstname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',  // Assurez-vous que la colonne dans la table users s'appelle bien 'email'
            'password' => 'required|string|min:8',
            'cin' => 'required|string|size:8',  // Validation pour un CIN de 8 caractères
            'role' => 'required|string|in:admin,user',  // Validation pour que le role soit 'admin' ou 'user'
            'tel' => 'required|string|max:15',  // Validation pour un numéro de téléphone
        ]);

        // Si la validation échoue, retourne les erreurs
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Création de l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'firstname' => $request->firstname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'cin' => $request->cin,
            'role' => $request->role,  // Remarque la correction ici : 'Role' -> 'role' en minuscule
            'tel' => $request->tel
        ]);

        // Générer un token pour l'utilisateur
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retourner une réponse avec succès et le token d'authentification
        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'token' => $token,
            'user' => $user
        ], 201);
    }

    // 🔹 Connexion d'un utilisateur
    public function login(Request $request)
    {
        // Vérification des identifiants
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        // Récupérer l'utilisateur connecté
        $user = Auth::user();

        // Générer un token pour l'utilisateur
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retourner une réponse avec le token d'authentification
        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user
        ], 200);
    }

    // 🔹 Récupérer les informations de l'utilisateur connecté
    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()], 200);
    }

    // 🔹 Déconnexion de l'utilisateur
    public function logout(Request $request)
    {
        // Supprimer tous les tokens de l'utilisateur
        $request->user()->tokens()->delete();

        // Retourner une réponse de déconnexion réussie
        return response()->json(['message' => 'Déconnexion réussie'], 200);
    }
}