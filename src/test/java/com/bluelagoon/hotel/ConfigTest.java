package com.bluelagoon.hotel;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "SUPABASE_URL=",
        "SUPABASE_KEY=",
        "stripe.secret.key=test",
        "stripe.public.key=test",
        "MAIL_PASSWORD=test"
})
class ConfigTest {

    @Test
    void contextLoads() {
        // This test will fail if the application context cannot start
        // due to missing required properties.
    }
}
