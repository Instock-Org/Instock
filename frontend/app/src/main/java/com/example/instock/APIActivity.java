package com.example.instock;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
//import android.util.Log;
//import android.widget.Button;

//import com.google.gson.JsonObject;

//import java.util.List;

//import retrofit2.Call;
//import retrofit2.Callback;
//import retrofit2.Response;
//import retrofit2.Retrofit;

public class APIActivity extends AppCompatActivity {
//    private final String TAG = "APIActivity";
//    private Button api_button;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_api);

        //Obtain an instance of Retrofit by calling the static method.
//        Retrofit retrofit = NetworkClient.getRetrofitClient();

        // The main purpose of Retrofit is to create HTTP calls from the Java interface based on the annotation associated with each method. This is achieved by just passing the interface class as parameter to the create method
//        final InstockAPIs instockAPIs = retrofit.create(InstockAPIs.class);


//        api_button = findViewById(R.id.api_button);
//        api_button.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {

//            }
//        });
    }

    /**
     * Returns all items matching the search term
     *
     * @param instockAPIs
     * @param term
     */
//    private void getAllItems(InstockAPIs instockAPIs, String term) {
//        // Invoke the method corresponding to the HTTP request which will return a Call object. This Call object will used to send the actual network request with the specified parameters
//        Call call = instockAPIs.getItem(term); // get request
//
//        // This is the line which actually sends a network request. Calling enqueue() executes a call asynchronously. It has two callback listeners which will invoked on the main thread
//        call.enqueue(new Callback() {
//            @Override
//            public void onResponse(Call call, Response response) {
//                // This is the success callback. Though the response type is JSON, with Retrofit we get the response in the form of ItemResponse POJO class
//                Log.d(TAG, String.valueOf(response.code()));
//                if (response.body() != null) {
//                    List<ItemResponse> res = (List<ItemResponse>) response.body();
//                    ItemResponse ItemResponse = res.get(0);
//                    Log.d(TAG, ItemResponse.getName());
//                }
//            }
//            @Override
//            public void onFailure(Call call, Throwable t) {
//                // Error callback
//                Log.d(TAG, t.getMessage());
//                Log.d(TAG, "API request failed");
//            }
//        });
//    }

    /**
     * Adds an item with the specified details to the Instock item database
     *
     * @param instockAPIs
     * @param name
     * @param description
     * @param barcode
     * @param units
     */
//    private void addItem(InstockAPIs instockAPIs, String name, String description, String barcode, String units) {
//        // JSON body
//        JsonObject body = new JsonObject();
//        body.addProperty("name", name);
//        body.addProperty("description", description);
//        body.addProperty("barcode", barcode);
//        body.addProperty("units", units);
//
//
//        Call call = instockAPIs.addItem(body); // post request
//
//        call.enqueue(new Callback() {
//            @Override
//            public void onResponse(Call call, Response response) {
//                // This is the success callback. Though the response type is JSON, with Retrofit we get the response in the form of ItemResponse POJO class
//                Log.d(TAG, String.valueOf(response.code()));
//                if (response.body() != null) {
//                    String res = response.body().toString();
//                    Log.d(TAG, res);
//                }
//            }
//            @Override
//            public void onFailure(Call call, Throwable t) {
//                // Error callback
//                Log.d(TAG, t.getMessage());
//                Log.d(TAG, "API request failed");
//            }
//        });
//    }
}
