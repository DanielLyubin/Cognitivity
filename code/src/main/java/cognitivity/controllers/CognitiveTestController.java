package cognitivity.controllers;

import cognitivity.Exceptions.DBException;
import cognitivity.Exceptions.ErrorType;
import cognitivity.dto.TestWrapper;
import cognitivity.entities.TestManager;
import cognitivity.services.CognitiveTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static cognitivity.Exceptions.ErrorType.SAVE;
import static cognitivity.controllers.AbstractRestController.crossOrigin;
import static cognitivity.controllers.CognitiveTestController.baseMapping;

/**
 * REST service for Cognitive Tests - allows to update, create, search and delete for cognitive tests for a
 * specific test manager or in general - by test id.
 */
@RestController
@RequestMapping(value = baseMapping,
        produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = crossOrigin)
public class CognitiveTestController extends AbstractRestController<CognitiveTestService> {

    public static final String baseMapping = "/tests";


    @Autowired
    public CognitiveTestController(CognitiveTestService service) {
        super(service);
    }


    /**
     * Method for searching for all cognitive tests of a manager.
     * <p>
     * Params are as in CognitiveTestService.
     *
     * @return - Cognitive test(s) for the test manager.
     */

    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET, value = "/findTestsForTestManager")
    public List<TestWrapper> findTestsForTestManager(
            @RequestParam(value = "managerId") long managerId) throws DBException {
        return service.findTestsForTestManager(managerId);
    }


    /**
     * Method for saving tests.
     * <p>
     * Params are as in CognitiveTestService.
     * If testId is null, then create. otherwise - update.
     */
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.POST, value = "/saveCognitiveTest")
    public TestWrapper saveCognitiveTest(
            @RequestBody TestWrapper cognitiveTest) throws DBException{
        return service.createTestForTestManager(cognitiveTest);
    }

    /**
     * Method for updating tests.
     * <p>
     * Params are as in CognitiveTestService.
     * If testId is null, then create. otherwise - update.
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.POST, value = "/updateCognitiveTest")
    public void updateCognitiveTest(
            @RequestBody TestWrapper test) {
        service.updateTestForTestManager(test);
    }

    /**
     * Method for delete tests.
     * <p>
     * Params are as in CognitiveTestService.
     */
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.DELETE, value = "/deleteCognitiveTest")
    public void deleteCognitiveTest(@RequestParam(value = "testId") long testId) {
        service.deleteTestForTestManager(testId);
    }
}
