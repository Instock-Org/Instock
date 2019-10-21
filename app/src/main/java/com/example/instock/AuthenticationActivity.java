package com.example.instock;

import android.app.Activity;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.login.Login;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import java.util.Arrays;

public class AuthenticationActivity extends AppCompatActivity {
    private final String TAG = "AuthenticationActivity";

//    private CallbackManager callbackManager;
//    private LoginButton loginButton;

    private GoogleSignInClient GoogleSignInClient;
    private SignInButton googleSignInButton;
    private Button signOut;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_authentication);

        // Facebook login
//        callbackManager = CallbackManager.Factory.create();
//
//        loginButton = (LoginButton) findViewById(R.id.login_button);
//        loginButton.setReadPermissions(Arrays.asList(
//                "public_profile", "email"));
//        loginButton.registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
//            @Override
//            public void onSuccess(LoginResult loginResult) {
//                Log.d(TAG, "User has successfully logged in");
//
//                Intent intent = new Intent(AuthenticationActivity.this, TestActivity.class);
//                startActivity(intent);
//                AuthenticationActivity.this.finish();
//            }
//
//            @Override
//            public void onCancel() {
//                Log.d(TAG, "User has cancelled the logged in process");
//            }
//
//            @Override
//            public void onError(FacebookException error) {
//                Log.d(TAG, "Oh no. You have some other problem.");
//            }
//        });

        // Google login
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();
        GoogleSignInClient = GoogleSignIn.getClient(this, gso);
        googleSignInButton = findViewById(R.id.sign_in_button);
        googleSignInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent signInIntent = GoogleSignInClient.getSignInIntent();
                startActivityForResult(signInIntent, 101);
            }
        });

        // Google logout
        signOut = (Button) findViewById(R.id.sign_out_button);
        signOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                GoogleSignInClient.signOut().addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        Log.d(TAG, "Successfully signed out of google");
                    }
                });
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        // Facebook login
//        callbackManager.onActivityResult(requestCode, resultCode, data);

        super.onActivityResult(requestCode, resultCode, data);

        // Google Login
        if (resultCode == Activity.RESULT_OK) {
            switch (requestCode) {
                case 101:
                    try {
                        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
                        GoogleSignInAccount account = task.getResult(ApiException.class);
                        Log.d(TAG, "google signin successful");
                        onGoogleLoggedIn(account);
                    } catch (ApiException e) {
                        // The ApiException status code indicates the detailed failure reason
                        Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
                    }
                    break;
            }
        }
    }

    private void onGoogleLoggedIn(GoogleSignInAccount account) {
        Intent intent = new Intent(this, TestActivity.class);
        intent.putExtra(TestActivity.GOOGLE_ACCOUNT, account);

        startActivity(intent);
        finish();
    }
}
