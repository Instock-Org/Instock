package com.example.instock;

import android.content.Intent;
import android.net.Uri;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {
    private final String TAG = "MapsActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }


    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        // Get stores list from intent
        Intent intent = getIntent();
        Bundle args = intent.getBundleExtra("BUNDLE");
        final List<Store> stores = (List<Store>) args.getSerializable("STORES");

//        JsonArray waypoints = new JsonArray();


        GoogleMap mMap = googleMap;

        for (Store store : stores) {
            // Add a marker and move the camera
            LatLng marker = new LatLng(store.getLat(), store.getLng());
            mMap.addMarker(new MarkerOptions().position(marker).title(store.getName()));
            mMap.moveCamera(CameraUpdateFactory.newLatLng(marker));

//            JsonArray waypoint = new JsonArray();
//            waypoint.add(store.getLat());
//            waypoint.add(store.getLng());
//            waypoints.add(waypoint);
        }

//        JsonObject body = new JsonObject();
//        JsonArray origin = new JsonArray();
//        origin.add("49.260587");
//        origin.add("-123.251153");
//        body.add("origin", origin);
//        body.add("destination", origin);
//        body.add("waypoints", waypoints);
//
//        Retrofit retrofit = NetworkClient.getRetrofitClient();
//        InstockAPIs instockAPIs = retrofit.create(InstockAPIs.class);
//
//        Call call = instockAPIs.getShortestPath(body); // post request
//
//        call.enqueue(new Callback() {
//            @Override
//            public void onResponse(Call call, Response response) {
//                Log.d(TAG, String.valueOf(response.code()));
//                if (response.body() != null) {
//                    List<String> res = (List<String>) response.body();
//
//                    StringBuilder url = new StringBuilder();
//                    url.append("https://www.google.com/maps/dir/?api=1&origin=49.260587,-123.251153&destination=49.260587,-123.251153&waypoints=");
//
//
//                    for (int i = 0; i < res.size(); i++) {
//                        int idx = Integer.parseInt(res.get(i));
//                        Store s = stores.get(idx);
//                        url.append(s.getLat());
//                        url.append(',');
//                        url.append(s.getLng());
//
//                        if (i != res.size() - 1) {
//                            url.append("%7C");
//                        }
//                    }
//
//                    url.append("&travelmode=walking&dir_action=navigate");
//                    final String uri = url.toString();
//
//                    Button directionsButton = findViewById(R.id.directions_button);
//                    directionsButton.setOnClickListener(new View.OnClickListener() {
//                        @Override
//                        public void onClick(View view) {
//                            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(uri));
//                            i.setPackage("com.google.android.apps.maps");
//                            startActivity(i);
//                        }
//                    });
//                }
//            }
//            @Override
//            public void onFailure(Call call, Throwable t) {
//                // Error callback
//                Log.d(TAG, t.getMessage());
//                Log.d(TAG, "API request failed");
//            }
//        });



        Button directionsButton = findViewById(R.id.directions_button);
        directionsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String uri = "https://www.google.com/maps/dir/?api=1&origin=49.260587,-123.251153&destination=49.260587,-123.251153&waypoints=49.2605024,-123.2476207%7C49.262369,-123.2501181&travelmode=walking&dir_action=navigate";
                Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(uri));
                i.setPackage("com.google.android.apps.maps");
                startActivity(i);
            }
        });
    }
}
