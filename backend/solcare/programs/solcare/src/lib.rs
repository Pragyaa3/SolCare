use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

declare_id!("ExXRXq98DzqwjMRedc4h9WUxs8EcxvKYeky3pHosvfDj");

#[program]
pub mod solcare {
    use super::*;

    pub fn initialize_platform(ctx: Context<InitializePlatform>) -> Result<()> {
        let platform = &mut ctx.accounts.platform;
        platform.authority = ctx.accounts.authority.key();
        platform.total_loans = 0;
        platform.total_emergencies = 0;
        platform.total_funded = 0;
        Ok(())
    }

    pub fn request_loan(
        ctx: Context<RequestLoan>, 
        amount: u64,
        purpose: String,
    ) -> Result<()> {
        require!(amount >= 2000 && amount <= 10000, ErrorCode::InvalidLoanAmount);
        require!(purpose.len() <= 200, ErrorCode::PurposeTooLong);

        let loan = &mut ctx.accounts.loan;
        let platform = &mut ctx.accounts.platform;
        let clock = Clock::get()?;

        loan.borrower = ctx.accounts.borrower.key();
        loan.amount = amount;
        loan.repaid = 0;
        loan.credit_score = 0;
        loan.purpose = purpose;
        loan.requested_at = clock.unix_timestamp;
        loan.is_active = true;
        loan.default_count = 0;

        platform.total_loans += 1;

        Ok(())
    }

    pub fn repay_loan(ctx: Context<RepayLoan>, amount: u64) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        require!(loan.is_active, ErrorCode::LoanNotActive);
        require!(amount > 0, ErrorCode::InvalidRepayment);

        // Transfer SOL from borrower to platform
        let ix = system_instruction::transfer(
            &ctx.accounts.borrower.key(),
            &ctx.accounts.platform.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.borrower.to_account_info(),
                ctx.accounts.platform.to_account_info(),
            ],
        )?;

        loan.repaid += amount;
        
        if loan.repaid >= loan.amount {
            loan.credit_score = 100;
            loan.is_active = false;
        } else {
            loan.credit_score = ((loan.repaid as f64 / loan.amount as f64) * 100.0) as u64;
        }

        Ok(())
    }

    pub fn post_emergency(
        ctx: Context<PostEmergency>, 
        requested_amount: u64,
        description: String,
        document_hash: String,
    ) -> Result<()> {
        require!(requested_amount > 0, ErrorCode::InvalidAmount);
        require!(description.len() <= 500, ErrorCode::DescriptionTooLong);
        require!(document_hash.len() == 64, ErrorCode::InvalidDocumentHash);

        let emergency = &mut ctx.accounts.emergency;
        let platform = &mut ctx.accounts.platform;
        let clock = Clock::get()?;

        emergency.patient = ctx.accounts.patient.key();
        emergency.hospital = Pubkey::default();
        emergency.amount = requested_amount;
        emergency.funded_amount = 0;
        emergency.description = description;
        emergency.document_hash = document_hash;
        emergency.verified = false;
        emergency.funded = false;
        emergency.created_at = clock.unix_timestamp;
        emergency.donors = Vec::new();

        platform.total_emergencies += 1;

        Ok(())
    }

    pub fn verify_emergency(ctx: Context<VerifyEmergency>) -> Result<()> {
        let emergency = &mut ctx.accounts.emergency;
        require!(!emergency.verified, ErrorCode::AlreadyVerified);

        emergency.hospital = ctx.accounts.hospital.key();
        emergency.verified = true;

        Ok(())
    }

    pub fn fund_emergency(ctx: Context<FundEmergency>, amount: u64) -> Result<()> {
        let emergency = &mut ctx.accounts.emergency;
        let platform = &mut ctx.accounts.platform_data;
        
        require!(emergency.verified, ErrorCode::NotVerified);
        require!(!emergency.funded, ErrorCode::AlreadyFunded);
        require!(amount > 0, ErrorCode::InvalidAmount);

        let ix = system_instruction::transfer(
            &ctx.accounts.donor.key(),
            &ctx.accounts.platform.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.donor.to_account_info(),
                ctx.accounts.platform.to_account_info(),
            ],
        )?;

        emergency.funded_amount += amount;
        emergency.donors.push(ctx.accounts.donor.key());

        if emergency.funded_amount >= emergency.amount {
            emergency.funded = true;
            platform.total_funded += 1;
        }

        Ok(())
    }

    pub fn withdraw_to_hospital(ctx: Context<WithdrawToHospital>) -> Result<()> {
        let emergency = &mut ctx.accounts.emergency;
        require!(emergency.funded, ErrorCode::NotFullyFunded);
        require!(emergency.hospital == ctx.accounts.hospital.key(), ErrorCode::UnauthorizedHospital);

        let amount = emergency.amount;

        **ctx.accounts.platform.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.hospital.to_account_info().try_borrow_mut_lamports()? += amount;

        let excess = emergency.funded_amount - emergency.amount;
        if excess > 0 {
            emergency.funded_amount = emergency.amount;
        }

        Ok(())
    }
}

#[account]
pub struct Platform {
    pub authority: Pubkey,
    pub total_loans: u64,
    pub total_emergencies: u64,
    pub total_funded: u64,
}

#[account]
pub struct Loan {
    pub borrower: Pubkey,
    pub amount: u64,
    pub repaid: u64,
    pub credit_score: u64,
    pub purpose: String,
    pub requested_at: i64,
    pub is_active: bool,
    pub default_count: u8,
}

#[account]
pub struct Emergency {
    pub patient: Pubkey,
    pub hospital: Pubkey,
    pub amount: u64,
    pub funded_amount: u64,
    pub description: String,
    pub document_hash: String,
    pub verified: bool,
    pub funded: bool,
    pub created_at: i64,
    pub donors: Vec<Pubkey>,
}

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8 + 8,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RequestLoan<'info> {
    #[account(
        init,
        payer = borrower,
        space = 8 + 32 + 8 + 8 + 8 + 4 + 200 + 8 + 1 + 1
    )]
    pub loan: Account<'info, Loan>,
    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
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
    /// CHECK: Platform account to receive funds
    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PostEmergency<'info> {
    #[account(
        init,
        payer = patient,
        space = 8 + 32 + 32 + 8 + 8 + 4 + 500 + 4 + 64 + 1 + 1 + 8 + 4 + (32 * 10)
    )]
    pub emergency: Account<'info, Emergency>,
    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(mut)]
    pub patient: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyEmergency<'info> {
    #[account(mut)]
    pub emergency: Account<'info, Emergency>,
    pub hospital: Signer<'info>,
}

#[derive(Accounts)]
pub struct FundEmergency<'info> {
    #[account(mut)]
    pub emergency: Account<'info, Emergency>,
    #[account(mut)]
    pub donor: Signer<'info>,
    /// CHECK: Platform account to receive funds
    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: AccountInfo<'info>,
    #[account(
        seeds = [b"platform"],
        bump
    )]
    pub platform_data: Account<'info, Platform>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawToHospital<'info> {
    #[account(mut)]
    pub emergency: Account<'info, Emergency>,
    #[account(mut)]
    pub hospital: Signer<'info>,
    /// CHECK: Platform account
    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Loan amount must be between 2000 and 10000 SOL")]
    InvalidLoanAmount,
    #[msg("Purpose description is too long")]
    PurposeTooLong,
    #[msg("Loan is not active")]
    LoanNotActive,
    #[msg("Invalid repayment amount")]
    InvalidRepayment,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Description is too long")]
    DescriptionTooLong,
    #[msg("Invalid document hash")]
    InvalidDocumentHash,
    #[msg("Emergency already verified")]
    AlreadyVerified,
    #[msg("Emergency not verified by hospital")]
    NotVerified,
    #[msg("Emergency already fully funded")]
    AlreadyFunded,
    #[msg("Emergency not fully funded")]
    NotFullyFunded,
    #[msg("Unauthorized hospital")]
    UnauthorizedHospital,
}