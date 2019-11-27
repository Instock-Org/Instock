package com.example.instock;

import android.app.Activity;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;
//import android.widget.Button;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class AuthenticationActivity extends AppCompatActivity {
    private final String TAG = "AuthenticationActivity";

    private GoogleSignInClient GoogleSignInClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_authentication);

    //    GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);

//        if (account != null) {
//            Intent intent = new Intent(AuthenticationActivity.this, UserViewActivity.class);
//            Log.d(TAG, "user already signed in");
//
//            startActivity(intent);
//            finish();
//        } else {
            // Google login
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestEmail()
                    .requestIdToken(getString(R.string.server_client_id))
                    .build();

            GoogleSignInClient = GoogleSignIn.getClient(this, gso);
            SignInButton googleSignInButton = findViewById(R.id.sign_in_button);
            googleSignInButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent signInIntent = GoogleSignInClient.getSignInIntent();
                    startActivityForResult(signInIntent, 101);
                }
            });

            // Google logout
            Button signOut = (Button) findViewById(R.id.sign_out_button);
            signOut.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    GoogleSignInClient.signOut().addOnCompleteListener(new OnCompleteListener<Void>() {
                        @Override
                        public void onComplete(@NonNull Task<Void> task) {
                            Log.d(TAG, "Successfully signed out of google");
                            Intent intent = new Intent(AuthenticationActivity.this, StartActivity.class);

                            startActivity(intent);
                            finish();
                        }
                    });
                }
            });
//        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

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

                default:
                    Log.d(TAG, "Didn't receive correct code");
                    break;
            }
        }
    }

    private void onGoogleLoggedIn(GoogleSignInAccount account) {
        String idTokenStr = account.getIdToken();
        final GoogleSignInAccount googleAcc = account;
        Log.d(TAG, idTokenStr);

        Retrofit retrofit = NetworkClient.getRetrofitClient();
        InstockAPIs instockAPIs = retrofit.create(InstockAPIs.class);

        JsonObject idToken = new JsonObject();
        idToken.addProperty("idToken", idTokenStr);

        Call call = instockAPIs.googleAuth(idToken); // post request

        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                Log.d(TAG, String.valueOf(response.code()));
                if (response.isSuccessful()) {
                    Intent intent = new Intent(AuthenticationActivity.this, UserViewActivity.class);
                    Log.d(TAG, googleAcc.getEmail());

                    startActivity(intent);
                    finish();
                } else {
                    Toast.makeText(getApplicationContext(),"Google authentication failed.",Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onFailure(Call call, Throwable t) {
                // Error callback
                Log.d(TAG, t.getMessage());
                Log.d(TAG, "API request failed");
            }
        });
    }
}
