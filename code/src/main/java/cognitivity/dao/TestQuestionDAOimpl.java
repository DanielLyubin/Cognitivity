package cognitivity.dao;

import cognitivity.entities.CognitiveTest;
import cognitivity.entities.TestBlock;
import cognitivity.entities.TestManager;
import cognitivity.entities.TestQuestion;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Guy on 20/1/18.
 *
 * Data Access Object for TestQuestion object
 * @Note! API documentation is in the Interfaces
 *
 */
@Repository
public class TestQuestionDAOimpl extends AbstractDAO<TestQuestion> implements TestQuestionDAO{


    public long add(TestQuestion testQuestion, Long testBlockId, Long cognitiveTestId, Long testManagerId) {
        Session session = sessionFactory.getCurrentSession();

        TestBlock proxyTestBlock = session.load(TestBlock.class, testBlockId);
        CognitiveTest proxyCognitiveTest = session.load(CognitiveTest.class, cognitiveTestId);
        TestManager proxyTestManager = session.load(TestManager.class, testManagerId);

        testQuestion.setTestBlock(proxyTestBlock);
        testQuestion.setCognitiveTest(proxyCognitiveTest);
        testQuestion.setTestManager(proxyTestManager);


        session.save(testQuestion);
        return testQuestion.getId();
    }

    public TestQuestion get(Long id) {
        return super.get(id, TestQuestion.class);
    }

    public void delete(Long id) {
        super.delete(id, TestQuestion.class);
    }

    @Transactional(readOnly = true)
    public List<TestQuestion> getTestQuestionsFromAManager(TestManager manager) {
        Session session = sessionFactory.getCurrentSession();
        String queryString = "from TestQuestion where testManager = :manager";
        Query<TestQuestion> query = session.createQuery(queryString, TestQuestion.class);
        query.setParameter("manager", manager);
        return query.getResultList();
    }

    @Transactional(readOnly = true)
    public String findPictureLinkPerQuestion(long questionId){
        Session session = sessionFactory.getCurrentSession();
        String queryString = "from TestQuestion where id = :questionId";
        Query<TestQuestion> query = session.createQuery(queryString, TestQuestion.class);
        query.setParameter("questionId", questionId);
        TestQuestion question = query.getSingleResult();
        return question.getPictureLink();
    }
}
