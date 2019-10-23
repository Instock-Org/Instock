package com.example.instock;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ExpandableListData {

        public static HashMap<String, List<String>> getData(List<Store> stores) {
            HashMap<String, List<String>> expandableListDetail = new HashMap<String, List<String>>();

//            List<String> itemList1 = new ArrayList<String>();
//            itemList1.add("Apple");
//            itemList1.add("Banana");
//            itemList1.add("Raspberry");
//
//            List<String> itemList2 = new ArrayList<String>();
//            itemList2.add("Bread");
//            itemList2.add("Cereal");
//
//            List<String> itemList3 = new ArrayList<String>();
//            itemList3.add("Yogurt");
//            itemList3.add("Turkey");
//
//            expandableListDetail.put("Save on Foods", itemList1);
//            expandableListDetail.put("Whole Foods", itemList2);
//            expandableListDetail.put("Safeway", itemList3);

            for (Store store : stores) {
                List<String> itemList = new ArrayList<String>();
                for (Item item : store.getItems()) {
                    itemList.add(item.getName());
                }
                expandableListDetail.put(store.getName(), itemList);
            }

            return expandableListDetail;
        }
}
