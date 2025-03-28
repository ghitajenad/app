<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            // Log des données brutes reçues
            Log::info('Données brutes reçues:', $request->all());
            
            // Dans la méthode register du AuthController, modifiez la règle de validation pour inclure 'agent'

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'firstname' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'cin' => 'required|string|max:255',
                'role' => 'required|string|in:admin,user,agent', // Ajout de 'agent' comme valeur valide
                'tel' => 'required|string|max:255',
            ]);

            // Log des données après validation
            Log::info('Données validées:', $validatedData);

            // Log pour déboguer
            Log::info('Données de rôle reçues:', ['role' => $request->role]);
            Log::info('Données validées:', ['role' => $validatedData['role']]);

            $user = User::create([
                'name' => $validatedData['name'],
                'firstname' => $validatedData['firstname'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'cin' => $validatedData['cin'],
                'role' => $validatedData['role'],
                'tel' => $validatedData['tel'],
            ]);

            // Log de l'utilisateur créé
            Log::info('Utilisateur créé:', $user->toArray());

            $token = auth('api')->login($user);

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'user' => $user,
                'token' => $token,
            ]);
        } catch (ValidationException $e) {
            // Log pour déboguer
            Log::error('Erreur de validation:', ['errors' => $e->errors()]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Log pour déboguer
            Log::error('Erreur d\'enregistrement:', ['message' => $e->getMessage()]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}

