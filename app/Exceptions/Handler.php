<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Http\JsonResponse;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception): JsonResponse
    {
        return response()->json([
            'message' => $exception->getMessage(),
            'status' => method_exists($exception, 'getStatusCode') ? $exception->getStatusCode() : 500
        ], method_exists($exception, 'getStatusCode') ? $exception->getStatusCode() : 500);
    }
}