package com.example.instock;

import android.content.Intent;
import android.net.Uri;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.List;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

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
        List<Store> stores = (List<Store>) args.getSerializable("STORES");
//        Log.d("MapActivity", stores.get(0).getName());

        GoogleMap mMap = googleMap;

        for (Store store : stores) {
            // Add a marker and move the camera
            LatLng marker = new LatLng(store.getLat(), store.getLng());
            mMap.addMarker(new MarkerOptions().position(marker).title(store.getName()));
            mMap.moveCamera(CameraUpdateFactory.newLatLng(marker));
        }

        try {
            Thread.sleep(3000);
            String uri = "https://www.google.com/maps/dir/?api=1&origin=49.260587,-123.251153&destination=49.260587,-123.251153&waypoints=49.2605024,-123.2476207%7C49.262369,-123.2501181&travelmode=walking&dir_action=navigate";
            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(uri));
            i.setPackage("com.google.android.apps.maps");
            startActivity(i);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
