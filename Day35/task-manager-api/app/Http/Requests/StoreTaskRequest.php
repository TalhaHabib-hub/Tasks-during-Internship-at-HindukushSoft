<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
public function authorize()
{
    return true; // allow anyone to make this request for now
}

public function rules()
{
    return [
        'title' => 'required|string|min:3|max:255',
        'description' => 'nullable|string',
    ];
}

public function messages()
{
    return [
        'title.required' => 'A task title is required.',
        'title.min' => 'Title must be at least 3 characters.',
    ];
}   /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
   
    
}
