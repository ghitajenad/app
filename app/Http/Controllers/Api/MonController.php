<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MonController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Bienvenue sur l\'API Laravel']);
    }
}
