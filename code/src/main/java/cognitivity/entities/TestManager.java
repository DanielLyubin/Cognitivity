package cognitivity.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
/**
 *
 * The Test Manager persistent (JPA) representation (tables).
 *
 */

@Entity
@Table(name = "testManager")
public class TestManager extends AbstractEntity {

    @Column(name = "email", unique = true)
	private String email;

	public TestManager(String email) {
		this.email = email;
	}

	/**
	 * Returns value of email
	 */
	public String getEmail() {

		return email;
	}

	/**
	 * Sets value of email
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	public TestManager() {}

}
