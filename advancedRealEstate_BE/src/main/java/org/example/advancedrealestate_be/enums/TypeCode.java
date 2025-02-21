package org.example.advancedrealestate_be.enums;

import java.util.Map;
import java.util.TreeMap;

public enum TypeCode {
    TANG_TRET("Tầng Trệt"),
    NGUYEN_CAN("Nguyên Căn"),
    NOI_THAT("Nội Thất");



    private  final String name;


    TypeCode(String name){
        this.name=name;
    }


    public static Map<String,String> type(){
        Map<String,String> typeCodes=new TreeMap<>();
        for(TypeCode it : TypeCode.values()){
            typeCodes.put(it.toString(), it.name);
        }
        return  typeCodes;
    }

}
