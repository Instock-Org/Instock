package com.example.instock;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class SearchTestActivity extends AppCompatActivity {

    private final String TAG = "ShoppingListActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_test);

        Retrofit retrofit = NetworkClient.getRetrofitClient();
        final InstockAPIs instockAPIs = retrofit.create(InstockAPIs.class);

        Button searchTestButton = findViewById(R.id.search_test_button);
        searchTestButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendApple(instockAPIs);
            }
        });
    }

    private void sendApple(InstockAPIs instockAPIs) {
        Call call = instockAPIs.getItem("apple"); // get request

        Log.d(TAG, "Request sent");
        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                Log.d(TAG, String.valueOf(response.code()));
                if (response.body() != null) {
                   // FewestStoresResponse res = (FewestStoresResponse) response.body();
                    //Log.d(TAG, res.getStores().get(0).getName());

                    Log.d(TAG, response.toString());
                    
                   // bundle.putSerializable("SEARCH", (Serializable)res.getStores());

//                    // Launch Shopping trip activity
//                    Intent intent = new Intent(SearchTestActivity.this, ShoppingTripActivity.class);
//                    intent.putExtra("BUNDLE", bundle);
//                    startActivity(intent);
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
