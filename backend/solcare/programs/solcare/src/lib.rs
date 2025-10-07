use anchor_lang::prelude::*;

declare_id!("ReplaceWithYourDeployedProgramID");

#[program]
pub mod solcare {
    use super::*;

    // ----------------------
    // MICRO-LOAN FUNCTIONS
    // ----------------------
    pub fn request_loan(ctx: Context<RequestLoan>, amount: u64) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        loan.borrower = *ctx.accounts.borrower.key;
        loan.amount = amount;
        loan.repaid = 0;
        loan.credit_score = 0; // initial score
        Ok(())
    }

    pub fn repay_loan(ctx: Context<RepayLoan>, amount: u64) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        loan.repaid += amount;
        // Simple credit score increment
        loan.credit_score = loan.repaid * 5 / loan.amount; 
        Ok(())
    }

    // ----------------------
    // EMERGENCY FUND FUNCTIONS
    // ----------------------
    pub fn post_emergency(ctx: Context<PostEmergency>, requested_amount: u64, zk_proof: Vec<u8>) -> Result<()> {
        let emergency = &mut ctx.accounts.emergency;
        emergency.patient = *ctx.accounts.patient.key;
        emergency.amount = requested_amount;
        emergency.zk_proof = zk_proof;
        emergency.funded = false;
        Ok(())
    }

    pub fn fund_emergency(ctx: Context<FundEmergency>, amount: u64) -> Result<()> {
        let emergency = &mut ctx.accounts.emergency;
        emergency.funded_amount += amount;
        if emergency.funded_amount >= emergency.amount {
            emergency.funded = true;
        }
        Ok(())
    }
}

// ----------------------
// ACCOUNTS
// ----------------------
#[account]
pub struct Loan {
    pub borrower: Pubkey,
    pub amount: u64,
    pub repaid: u64,
    pub credit_score: u64, // 0-5 stars
}

#[account]
pub struct Emergency {
    pub patient: Pubkey,
    pub amount: u64,
    pub funded_amount: u64,
    pub zk_proof: Vec<u8>,
    pub funded: bool,
}

// ----------------------
// CONTEXTS
// ----------------------
#[derive(Accounts)]
pub struct RequestLoan<'info> {
    #[account(init, payer = borrower, space = 8 + 32 + 8 + 8 + 8)]
    pub loan: Account<'info, Loan>,
    #[account(mut)]
    pub borrower: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RepayLoan<'info> {
    #[account(mut)]
    pub loan: Account<'info, Loan>,
    #[account(mut)]
    pub borrower: Signer<'info>,
}

#[derive(Accounts)]
pub struct PostEmergency<'info> {
    #[account(init, payer = patient, space = 8 + 32 + 8 + 8 + 4 + 1024 + 1)]
    pub emergency: Account<'info, Emergency>,
    #[account(mut)]
    pub patient: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FundEmergency<'info> {
    #[account(mut)]
    pub emergency: Account<'info, Emergency>,
    #[account(mut)]
    pub donor: Signer<'info>,
    pub system_program: Program<'info, System>,
}
