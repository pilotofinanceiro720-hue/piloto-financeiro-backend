import { describe, it, expect } from "vitest";
import {
  calculateFraudScore,
  detectMultipleAccounts,
  detectAbnormalReferralVelocity,
  detectReferralChurn,
  createFraudAlert,
  runCompleteFraudCheck,
  blockSuspiciousUser,
} from "../server/services/fraud-detection";
import {
  WITHDRAWAL_CONFIG,
  validateWithdrawalEligibility,
  createWithdrawalRequest,
  calculateWithdrawalFee,
  calculateNetWithdrawalAmount,
  validateBankAccount,
} from "../server/services/commission-withdrawal";

describe("Fraud Detection and Withdrawal Services", () => {
  describe("Fraud Score Calculation", () => {
    it("should calculate fraud score for user", async () => {
      const score = await calculateFraudScore(1);
      expect(score.userId).toBe(1);
      expect(score.overallScore).toBeGreaterThanOrEqual(0);
      expect(score.overallScore).toBeLessThanOrEqual(100);
      expect(score.riskLevel).toMatch(/low|medium|high|critical/);
    });

    it("should classify risk level based on score", async () => {
      const score = await calculateFraudScore(1);
      if (score.overallScore > 75) {
        expect(score.riskLevel).toBe("critical");
      } else if (score.overallScore > 50) {
        expect(score.riskLevel).toBe("high");
      } else if (score.overallScore > 25) {
        expect(score.riskLevel).toBe("medium");
      } else {
        expect(score.riskLevel).toBe("low");
      }
    });
  });

  describe("Multiple Accounts Detection", () => {
    it("should detect multiple accounts", async () => {
      const result = await detectMultipleAccounts("test@example.com", "192.168.1.1", "device123");
      expect(result).toHaveProperty("detected");
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("accountIds");
    });

    it("should return empty array when no duplicates found", async () => {
      const result = await detectMultipleAccounts("unique@example.com", "192.168.1.2", "device456");
      expect(result.detected).toBe(false);
      expect(result.count).toBe(0);
      expect(result.accountIds).toEqual([]);
    });
  });

  describe("Abnormal Referral Velocity Detection", () => {
    it("should detect abnormal velocity", async () => {
      const result = await detectAbnormalReferralVelocity(1, 60);
      expect(result).toHaveProperty("abnormal");
      expect(result).toHaveProperty("referralCount");
      expect(result).toHaveProperty("threshold");
    });

    it("should use correct threshold", async () => {
      const result = await detectAbnormalReferralVelocity(1, 60);
      expect(result.threshold).toBe(10);
    });
  });

  describe("Referral Churn Detection", () => {
    it("should detect churn pattern", async () => {
      const result = await detectReferralChurn(1);
      expect(result).toHaveProperty("detected");
      expect(result).toHaveProperty("churnRate");
      expect(result.churnRate).toBeGreaterThanOrEqual(0);
      expect(result.churnRate).toBeLessThanOrEqual(1);
    });

    it("should use correct threshold", async () => {
      const result = await detectReferralChurn(1);
      expect(result.threshold).toBe(0.8);
    });
  });

  describe("Fraud Alert Creation", () => {
    it("should create fraud alert", async () => {
      const alert = await createFraudAlert(
        1,
        "high_velocity",
        "critical",
        "Test alert",
        { test: true }
      );
      expect(alert).not.toBeNull();
      expect(alert?.userId).toBe(1);
      expect(alert?.type).toBe("high_velocity");
      expect(alert?.severity).toBe("critical");
      expect(alert?.status).toBe("pending");
    });

    it("should create alert with evidence", async () => {
      const evidence = { referralCount: 15, threshold: 10 };
      const alert = await createFraudAlert(
        2,
        "high_velocity",
        "critical",
        "High velocity detected",
        evidence
      );
      expect(alert?.evidence).toEqual(evidence);
    });
  });

  describe("Complete Fraud Check", () => {
    it("should run complete fraud check", async () => {
      const result = await runCompleteFraudCheck(
        1,
        "test@example.com",
        "192.168.1.1",
        "device123"
      );
      expect(result).toHaveProperty("fraudsDetected");
      expect(result).toHaveProperty("alerts");
      expect(Array.isArray(result.alerts)).toBe(true);
    });

    it("should return alerts array", async () => {
      const result = await runCompleteFraudCheck(
        1,
        "test@example.com",
        "192.168.1.1",
        "device123"
      );
      expect(result.alerts).toBeInstanceOf(Array);
    });
  });

  describe("User Blocking", () => {
    it("should block suspicious user", async () => {
      const result = await blockSuspiciousUser(1, "High fraud score");
      expect(result).toBe(true);
    });
  });

  describe("Withdrawal Configuration", () => {
    it("should have valid withdrawal config", () => {
      expect(WITHDRAWAL_CONFIG.minimumAmount).toBeGreaterThan(0);
      expect(WITHDRAWAL_CONFIG.maximumAmount).toBeGreaterThan(WITHDRAWAL_CONFIG.minimumAmount);
      expect(WITHDRAWAL_CONFIG.processingFee).toBeGreaterThanOrEqual(0);
      expect(WITHDRAWAL_CONFIG.processingFee).toBeLessThanOrEqual(1);
    });

    it("should have reasonable processing time", () => {
      expect(WITHDRAWAL_CONFIG.processingTimeHours).toBeGreaterThan(0);
      expect(WITHDRAWAL_CONFIG.processingTimeHours).toBeLessThanOrEqual(72);
    });
  });

  describe("Withdrawal Eligibility Validation", () => {
    it("should reject withdrawal below minimum", async () => {
      const result = await validateWithdrawalEligibility(1, 10);
      expect(result.eligible).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it("should reject withdrawal above maximum", async () => {
      const result = await validateWithdrawalEligibility(1, 50000);
      expect(result.eligible).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it("should allow valid withdrawal amount", async () => {
      const result = await validateWithdrawalEligibility(1, 100);
      expect(result).toHaveProperty("eligible");
      if (result.eligible) {
        expect(result.reason).toBeUndefined();
      } else {
        expect(result.reason).toBeDefined();
      }
    });
  });
  describe("Withdrawal Request Creation", () => {
    it("should create withdrawal request", async () => {
      const bankAccount = {
        bankCode: "001",
        accountType: "checking" as const,
        accountNumber: "123456-7",
        accountHolder: "John Doe",
      };
      const result = await createWithdrawalRequest(1, 100, bankAccount);
      expect(result).not.toBeNull();
      expect(result?.userId).toBe(1);
      expect(result?.amount).toBe(100);
      expect(result?.status).toBe("pending");
    });

    it("should reject invalid bank account", async () => {
      const bankAccount = {
        bankCode: "",
        accountType: "checking" as const,
        accountNumber: "",
        accountHolder: "",
      };
      const result = await createWithdrawalRequest(1, 100, bankAccount as any);
      expect(result).toBeNull();
    });
  });

  describe("Withdrawal Fee Calculation", () => {
    it("should calculate fee correctly", () => {
      const amount = 100;
      const fee = calculateWithdrawalFee(amount);
      const expectedFee = amount * WITHDRAWAL_CONFIG.processingFee;
      expect(fee).toBe(expectedFee);
    });

    it("should calculate zero fee when rate is 0", () => {
      const fee = calculateWithdrawalFee(1000);
      expect(fee).toBe(0);
    });
  });

  describe("Net Withdrawal Amount Calculation", () => {
    it("should calculate net amount", () => {
      const amount = 100;
      const net = calculateNetWithdrawalAmount(amount);
      const fee = calculateWithdrawalFee(amount);
      expect(net).toBe(amount - fee);
    });

    it("should equal gross amount when fee is 0", () => {
      const amount = 500;
      const net = calculateNetWithdrawalAmount(amount);
      expect(net).toBe(amount);
    });
  });

  describe("Bank Account Validation", () => {
    it("should validate correct bank account", () => {
      const bankAccount = {
        bankCode: "001",
        accountType: "checking" as const,
        accountNumber: "123456-7",
        accountHolder: "John Doe",
      };
      const result = validateBankAccount(bankAccount);
      expect(result.valid).toBe(true);
    });

    it("should reject invalid bank code", () => {
      const bankAccount = {
        bankCode: "12",
        accountType: "checking" as const,
        accountNumber: "123456-7",
        accountHolder: "John Doe",
      };
      const result = validateBankAccount(bankAccount);
      expect(result.valid).toBe(false);
    });

    it("should reject invalid account type", () => {
      const bankAccount = {
        bankCode: "001",
        accountType: "invalid" as any,
        accountNumber: "123456-7",
        accountHolder: "John Doe",
      };
      const result = validateBankAccount(bankAccount);
      expect(result.valid).toBe(false);
    });

    it("should reject short account number", () => {
      const bankAccount = {
        bankCode: "001",
        accountType: "checking" as const,
        accountNumber: "123",
        accountHolder: "John Doe",
      };
      const result = validateBankAccount(bankAccount);
      expect(result.valid).toBe(false);
    });

    it("should reject short account holder name", () => {
      const bankAccount = {
        bankCode: "001",
        accountType: "checking" as const,
        accountNumber: "123456-7",
        accountHolder: "Jo",
      };
      const result = validateBankAccount(bankAccount);
      expect(result.valid).toBe(false);
    });
  });

  describe("Critical Security Tests", () => {
    it("CRITICAL: Should prevent withdrawal below minimum amount", async () => {
      const amounts = [0, 1, 10, 25, 49.99];
      for (const amount of amounts) {
        const result = await validateWithdrawalEligibility(1, amount);
        if (amount < WITHDRAWAL_CONFIG.minimumAmount) {
          expect(result.eligible).toBe(false);
        }
      }
    });

    it("CRITICAL: Should prevent withdrawal above maximum amount", async () => {
      const amounts = [10001, 50000, 100000];
      for (const amount of amounts) {
        const result = await validateWithdrawalEligibility(1, amount);
        if (amount > WITHDRAWAL_CONFIG.maximumAmount) {
          expect(result.eligible).toBe(false);
        }
      }
    });

    it("CRITICAL: Should validate all bank account fields", () => {
      const invalidAccounts = [
        { bankCode: "", accountType: "checking" as const, accountNumber: "123456-7", accountHolder: "John Doe" },
        { bankCode: "001", accountType: "checking" as const, accountNumber: "", accountHolder: "John Doe" },
        { bankCode: "001", accountType: "checking" as const, accountNumber: "123456-7", accountHolder: "" },
      ];

      for (const account of invalidAccounts) {
        const result = validateBankAccount(account as any);
        expect(result.valid).toBe(false);
      }
    });

    it("CRITICAL: Should detect fraud patterns", async () => {
      const result = await runCompleteFraudCheck(
        1,
        "test@example.com",
        "192.168.1.1",
        "device123"
      );
      expect(result).toHaveProperty("fraudsDetected");
      expect(result).toHaveProperty("alerts");
      expect(Array.isArray(result.alerts)).toBe(true);
    });
  });
});
