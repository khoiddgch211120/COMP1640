package com.example.comp1640.dto.request;

<<<<<<< HEAD
import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
=======
<<<<<<<< HEAD:backend/comp1640/src/main/java/com/example/comp1640/dto/request/TermsconditionsRequest.java
import java.time.LocalDate;

import lombok.Getter;
========
import lombok.AllArgsConstructor;
import lombok.Data;
>>>>>>>> 43f3aebc0c95dc7738436e7e1bd8d1951d6d7cab:backend/comp1640/src/main/java/com/example/comp1640/dto/request/TermsConditionsRequest.java
import lombok.NoArgsConstructor;

<<<<<<<< HEAD:backend/comp1640/src/main/java/com/example/comp1640/dto/request/TermsconditionsRequest.java
@Getter
@Setter
========
import java.time.LocalDate;

@Data
>>>>>>>> 43f3aebc0c95dc7738436e7e1bd8d1951d6d7cab:backend/comp1640/src/main/java/com/example/comp1640/dto/request/TermsConditionsRequest.java
@NoArgsConstructor
@AllArgsConstructor
>>>>>>> 43f3aebc0c95dc7738436e7e1bd8d1951d6d7cab
public class TermsConditionsRequest {

    private String version;
    private String content;
    private LocalDate effectiveDate;
}
