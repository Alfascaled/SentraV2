<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\TutorController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContentController;

// ── Public routes ───────────────────────────────────────────
Route::post('/auth/login', [AuthController::class, 'login']);

// Public read-only
Route::get('/content',   [ContentController::class, 'show']);
Route::get('/settings',  [SettingController::class, 'show']);
Route::get('/programs',  [ProgramController::class, 'index']);
Route::get('/tutors',    [TutorController::class,   'index']);
Route::get('/packages',  [PackageController::class, 'index']);
Route::get('/faq',       [FaqController::class,     'index']);
Route::get('/faqs',      [FaqController::class,     'index']);

// Public registration (pendaftaran siswa dari landing page)
Route::post('/registrations', [RegistrationController::class, 'store']);

// ── Protected routes (Sanctum) ──────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/auth/me',              [AuthController::class, 'me']);
    Route::post('/auth/logout',         [AuthController::class, 'logout']);
    Route::post('/auth/change-password',[AuthController::class, 'changePassword']);

    // Settings (write)
    Route::put('/settings', [SettingController::class, 'update']);

    // Admin dashboard
    Route::get('/admin/summary',       [AdminController::class, 'summary']);
    Route::get('/admin/whatsapp',      [AdminController::class, 'getWhatsapp']);
    Route::put('/admin/whatsapp',      [AdminController::class, 'updateWhatsapp']);

    // Registrations (admin manage)
    Route::get('/registrations',            [RegistrationController::class, 'index']);
    Route::patch('/registrations/{id}',     [RegistrationController::class, 'update']);
    Route::delete('/registrations/{id}',    [RegistrationController::class, 'destroy']);
    Route::get('/registrations/summary',    [RegistrationController::class, 'summary']);

    // Programs CRUD
    Route::post('/programs',        [ProgramController::class, 'store']);
    Route::put('/programs/{id}',    [ProgramController::class, 'update']);
    Route::delete('/programs/{id}', [ProgramController::class, 'destroy']);

    // Tutors CRUD
    Route::post('/tutors',          [TutorController::class, 'store']);
    Route::put('/tutors/{id}',      [TutorController::class, 'update']);
    Route::delete('/tutors/{id}',   [TutorController::class, 'destroy']);

    // Packages CRUD
    Route::post('/packages',        [PackageController::class, 'store']);
    Route::put('/packages/{id}',    [PackageController::class, 'update']);
    Route::delete('/packages/{id}', [PackageController::class, 'destroy']);

    // FAQ CRUD
    Route::post('/faq',             [FaqController::class, 'store']);
    Route::put('/faq/{id}',         [FaqController::class, 'update']);
    Route::delete('/faq/{id}',      [FaqController::class, 'destroy']);
    Route::post('/faqs',            [FaqController::class, 'store']);
    Route::put('/faqs/{id}',        [FaqController::class, 'update']);
    Route::delete('/faqs/{id}',     [FaqController::class, 'destroy']);

    // Upload
    Route::post('/upload', [UploadController::class, 'store']);
});
