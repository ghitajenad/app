<?php

// use Illuminate\Support\Facades\Route;

// Route::get('/test', function () {
//     return response()->json(['message' => 'API is working!']);
// });

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Laravel\Sanctum\Sanctum;
use App\Http\Controllers\Api\MonController;

Route::get('/mon-controller', [MonController::class, 'index']);

// Route d'inscription
Route::post('/register', [AuthController::class, 'register']);

// Route de connexion
Route::post('/login', [AuthController::class, 'login']);

// Route protégée (Dashboard)
Route::middleware('auth:sanctum')->get('/dashboard', function (Request $request) {
    return response()->json(['message' => 'Bienvenue sur le dashboard', 'user' => $request->user()]);
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});