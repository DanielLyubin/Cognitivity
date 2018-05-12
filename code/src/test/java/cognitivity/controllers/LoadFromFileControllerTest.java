package cognitivity.controllers;

import cognitivity.services.LoadFromFileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import config.TestContextBeanConfiguration;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by ophir on 12/05/18.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {TestContextBeanConfiguration.class})
public class LoadFromFileControllerTest implements RestControllerTest {

    private LoadFromFileController controller;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LoadFromFileService loadFromFileServiceMock;

    @Before
    public void setUp() {
        Mockito.reset(loadFromFileServiceMock);

        controller = new LoadFromFileController(loadFromFileServiceMock);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @Override
    public void controllerInitializedCorrectly() {
        Assert.assertThat(controller, CoreMatchers.notNullValue());
    }


    @Test
    public void testReadJSONFile() throws Exception {
        // final String fileName = "/home/ophir/Desktop/studies/semester8/Projects/Cognitivity-spring/Cognitivity/code/src/test/resources/test1.json";
        final String fileName = "hello.json";

        mockMvc.perform(post("/load-from-file/loadFromJSONFile")
                .param("fileName", fileName))
                .andDo(print())
                .andExpect(status().isOk());
    }
}


