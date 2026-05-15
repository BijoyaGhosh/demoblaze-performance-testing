# DemoBlaze Performance Testing Project

## Project Overview
This project focuses on performance testing of the DemoBlaze web application (https://www.demoblaze.com/) using Apache JMeter. It evaluates how the system performs under multiple concurrent users by measuring response time, stability, throughput, and overall system behavior under load.

## Tools Used
- Apache JMeter  

## Test Scenario
The test simulates a real user journey:
Homepage → Login → Product List → Product Details → Add to Cart → View Cart → Place Order

## Test Design
- Test Plan created for end-to-end flow  
- Thread Group used for multiple users  
- CSV file used for different user credentials  
- HTTP requests added for all steps  
- Transaction Controllers used for:
  - Login flow  
  - Purchase flow  
- Assertions used to check:
  - Response code  
  - Response text  
  - Duration
  - Size  
- Timers used:
  - Constant Timer  
  - Uniform Random Timer  
- Listeners added for analysis:
  - View Results Tree (for debugging)
  - View Results Table (for request-level details)
  - Aggregate Report (main performance analysis)
  - Summary Report (quick overview of results)
  - Graph Results (visual performance trends)
  - Assertion Results (to track failed assertions)

## Load Setup
- Multiple virtual users used  
- Gradual ramp-up applied  
- Loop execution for continuous testing  

## Performance Results
- Total Requests: 350  
- Success Rate: 99.43%  
- Failure Rate: 0.57%  
- Average Response Time: ~402 ms  

- HTML Dashboard report was generated using Apache JMeter command line (non-GUI mode).  
- The report provides a detailed visual summary of performance metrics like response time, throughput, and error rate.

## Key Observations
- Most requests worked fine under load  
- System handled multiple users properly  
- Login and homepage were slightly slower  
- A few requests failed due to response time limit  
- Overall performance is stable  

## Conclusion
The DemoBlaze application performed well under load testing. Most features worked correctly with good response time. A small number of requests were slow or failed due to performance limits.
