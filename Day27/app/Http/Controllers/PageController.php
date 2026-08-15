<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function showHome(){
        return view('welcome');
    }

    public function showUser(string $id){
        return view('firstpost',['id'=>$id]);
        // if key and value has the same meaning we can do this too
        // return view('firstpost',compact('id'));

    }

    public function showBlog(){
        return view('blog');
    }
}
