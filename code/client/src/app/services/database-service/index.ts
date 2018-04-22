import { Injectable } from '@angular/core';
import { Test, Manager, Question, Block } from '../../models';
import { Http, Headers } from '@angular/http'
import { RequestOptionsArgs } from '@angular/http/src/interfaces';

// Error handler class, holds behavior when errors are returned from server
class ErrorHandler {
    static handleError(error: any) {
        console.error('Error', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}

/*
This service connects our front-end components against the DB.
Each function is described well by is name.
*/
@Injectable()
export class TestManagerService {

    //tuples for representing the way we send data between the front-end and DB. 
    private headers = new Headers({'Content-Type': 'application/json'});

    //the basic route mapping.
    base_mapping = '/test-managers';

    //default constructor, getting the HTTP service.
    constructor(private http : Http) {}


    saveTestManager(email: string): Promise<void> {
        return this.http.post(`http://localhost:8181${this.base_mapping}/saveTestManager`, JSON.stringify({'email': email}),{headers: this.headers})
        .toPromise()
        .then(() => null) 
        .catch(ErrorHandler.handleError);
    }

    updateTestManager(manager: Manager): Promise<Manager> {
        return this.http.post(`http://localhost:8181${this.base_mapping}/updateTestManager`, JSON.stringify(manager), {headers: this.headers})
        .toPromise()
        .then(res => res.json() as Manager)
        .catch(ErrorHandler.handleError);
    }

    getManagerId(email: string): Promise<number> {
        return this.http.get(`http://localhost:8181${this.base_mapping}/findTestManagerIdByEmail?email=${email}`)
        .toPromise()
        .then(res => {
            if (res.status == 204) 
                return -1;
            
            return parseInt(res.text())
        })
        .catch(ErrorHandler.handleError)
    }

    deleteTestManager(id: number): Promise<void> {
        return this.http.delete(`http://localhost:8181${this.base_mapping}/deleteTestManager`+'/${id}',{headers: this.headers})
        .toPromise()
        .then(() => null)
        .catch(ErrorHandler.handleError);
    }

    getTestManager(managerId: number): Promise<any> {
        return this.http.get(`http://localhost:8181${this.base_mapping}/findTestManagersForTestCriteria?testManagerId=${managerId}&testId=-1`)
        .toPromise()
        .then(res => { if (res.text() == '') return null; return res.json()})
    }
}

@Injectable()
export class SubjectService {
    //functions
    constructor() {}
}

@Injectable()
export class TestService {
    //functions
    private headers = new Headers({'Content-Type': 'application/json'});
    base_mapping = '/tests';
    findTestsForTestManager(managerId: number): Promise<Test[]> {
        return this.http.get(`http://localhost:8181${this.base_mapping}/findTestsForTestManagerWithoutQuestions?managerId=${managerId}`)
        .toPromise()
        .then(response => response.json() as Test[])
        .catch(ErrorHandler.handleError)
    }
    saveCognitiveTest(test: Test): Promise<void> {
        return this.http.post(`http://localhost:8181${this.base_mapping}/saveCognitiveTest`,JSON.stringify(test),{headers : this.headers})
        .toPromise()
        .then(() => null)
        .catch(ErrorHandler.handleError);
    }

    deleteCognitiveTest(testId: number): Promise<void> {
        return this.http.delete(`http://localhost:8181${this.base_mapping}/deleteCognitiveTest?testId=${testId}`, {headers: this.headers})
        .toPromise()
        .then(() => null)
        .catch(ErrorHandler.handleError)
    }
    updateCognitiveTest(test: Test): Promise<Test> {
        return this.http.post(`http://localhost:8181${this.base_mapping}/updateCognitiveTest`, JSON.stringify(test), {headers: this.headers})
        .toPromise()
        .then(res => res.json() as Test)
        .catch(ErrorHandler.handleError)
    }

    findCognitiveTestById(testId: number) : Promise<Test> {
        return this.http.get(`http://localhost:8181${this.base_mapping}/findCognitiveTestById?TestId=${testId}`)
        .toPromise()
        .then(response => response.json() as Test)
        .catch(ErrorHandler.handleError)
    }
    

   
    constructor(private http : Http) {}
}


@Injectable()
export class QuestionService {
    //functions
    base_mapping = '/test-questions';

    private headers = new Headers({'Content-Type': 'application/json'});

    
    constructor(private http: Http) {}

    findTestQuestionsForManager(managerId: number, testId: number = null): Promise<Question[]> {
        if (testId == null) {
            return this.http.get(`http://localhost:8181${this.base_mapping}/findTestQuestionsForTestCriteriaById?managerId=${managerId}`)
            .toPromise()
            .then(res => res.json() as Question[])
            .catch(ErrorHandler.handleError);
        }
        return this.http.get(`http://localhost:8181${this.base_mapping}/findTestQuestionsForTestCriteriaById?managerId=${managerId}&testId=${testId}`)
            .toPromise()
            .then(res => res.json() as Question[])
            .catch(ErrorHandler.handleError);
    }

    deleteTestQuestion(questionId: number): Promise<void> {
        return this.http.delete(`http://localhost:8181${this.base_mapping}/deleteTestQuestion?questionId=${questionId}`, {headers: this.headers})
        .toPromise()
        .then(() => null)
        .catch(ErrorHandler.handleError);
    }

}



@Injectable()
export class TestAnswerService {
    //functions
    constructor() {}
}