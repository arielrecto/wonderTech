<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Dflydev\DotAccessData\Data;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    
    public function login(){

        return view('components.layouts.content.authentication.login');

    }

    public function dashboard(Request $request){ 


        $userLogged = $request->session()->get('loggedUser');

        $user = User::find($userLogged);
    
        return view('components.layouts.content.dashboard', compact(['user']));

    }

    public function check(Request $request) {

        $request->validate([
            'username'=> ['required'],
            'password'=>['required'],
        ]);

        $userInfo = User::where('name', '=', $request->username)->first();
        
        
        if(!$userInfo) {

            return back()->with('failed', 'We can\'t recognized your account');

        } else {

            if(Hash::check($request->password, $userInfo->password)){
                
                $request->session()->put('loggedUser', $userInfo->id);

                return view('components.layouts.content.dashboard');


            } else {
                

                return back()->with('failed', 'Incorrect Password');

                
            }
    

        }


    }

    public function register(){

        return view('components.layouts.content.authentication.register');

    }

    public function create(Request $request){

        $request->validate([

        'username'=>['required'],
        'password'=>['required'],

        ]);

        $data = new User([
            'name'=>$request->input('username'),
            'password'=>Hash::make($request->input('password')),
        ]);
        $save = $data->save();

        if($save){

            return redirect('/admin/login');

        }

        return back()->with('failed');
      
    }
    public function logout(){

        if(session()->has('loggedUser')){

            session()->pull('loggedUser');


            return redirect('/admin/login');


        }

        
    }


}
