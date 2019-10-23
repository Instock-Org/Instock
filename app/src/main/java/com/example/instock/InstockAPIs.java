package com.example.instock;

import com.google.gson.JsonObject;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface InstockAPIs {
    /*
    Get request to fetch items that match a search term (exact match)
    */
    @GET("/api/items")
    Call<List<ItemResponse>> getItem(@Query("search_term") String term);

    /*
    Post request to add a new item to the catalogue
    */
    @Headers("Content-Type: application/json")
    @POST("/api/items")
    Call<String> addItem(@Body JsonObject body);

    /*
    Post request to send shopping list
    */
    @Headers("Content-Type: application/json")
    @POST("/api/stores/feweststores")
    Call<FewestStoresResponse> sendShoppingList(@Body JsonObject body);
}
