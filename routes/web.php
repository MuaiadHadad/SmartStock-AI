<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Redirect the root URL to the Next.js app homepage (app/page.tsx)
    return redirect('/smartstock-frontend');
});
