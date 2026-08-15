<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\TestingController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// the above one is getting override 

Route::get('/post', function () {
    return view('post');
    // return "<p>This is you Talha Habib</p>";
});

// this is the simplest way to do the above stuffs
// Route::view('post','/post');

// name  can be anything as i changed that from post to hello this will just be shown to the user but in the behind post will be running

// Route::get('/hello', function () {
//     return view('post');
// });
Route::get('/post/firstpost', function () {
    return view('firstpost');
    // return "<p>This is you Talha Habib</p>";
});

// I want make route for PageController

// use App\Http\Controllers\PageController;//redefination
Route::get('/',[PageController::class,'showHome'])->name('home');
Route::get('/user/{id}',[PageController::class,'showUser'])->name('users');
Route::get('/blog',[PageController::class,'showBlog'])->name('blog');
Route::get('/test',TestingController::class);

// Talha I am seeing that I am using the pageContrller too much so to avoid this I will do this
/*
Route::controller(PageController::class)->group(function(){
    Route::get('/','showHome')->name('home');
    Route::get('/user/{id}','showUser')->name('users');
    Route::get('/blog','showBlog')->name('blog');
});
*/

