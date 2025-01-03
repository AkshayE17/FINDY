import { IRecruiterService } from '../interfaces/recruiters/IRecruiterService';
import { IRecruiterRepository } from '../interfaces/recruiters/IRecruiterRepository';
import { IRecruiter } from '../models/Recruiter';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../util/token.util';
import { hashPassword } from '../util/pass.util';

export class RecruiterService implements IRecruiterService {
  constructor(private _recruiterRepository: IRecruiterRepository) {}

  async registerRecruiter(recruiterData: IRecruiter): Promise<IRecruiter> {
    try {
      const existingRecruiter = await this._recruiterRepository.findRecruiterByEmail(recruiterData.email);
      
      if (existingRecruiter) {
        throw new Error('Recruiter with this email already exists.');
      }

      recruiterData.password = await hashPassword(recruiterData.password);

      const newRecruiter = await this._recruiterRepository.createRecruiter(recruiterData);

      return newRecruiter;
    } catch (error) {
      throw new Error(`Failed to register recruiter: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async verifyOtp(email: string): Promise<IRecruiter | null> {
    try {
      const recruiter = await this._recruiterRepository.findRecruiterByEmail(email);
      if (!recruiter) {
        throw new Error('Recruiter not found.');
      }

      recruiter.isVerified = true;
      await recruiter.save();
      return recruiter;
    } catch (error) {
      throw new Error(`Failed to verify OTP: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async loginRecruiter(email: string, password: string): Promise<{ recruiter: IRecruiter, accessToken: string, refreshToken: string }> {
    try {
      const recruiter = await this._recruiterRepository.findRecruiterByEmail(email);

      if (!recruiter) {
        throw new Error('Recruiter not found.');
      }

      if(!recruiter.isVerified) {
        throw new Error('Recruiter is not verified.');
      }

      const isMatch = await bcrypt.compare(password, recruiter.password);

      if (!isMatch) {
        throw new Error('Invalid password');
      }

      if(recruiter.isBlocked === true) {
        throw new Error('User is blocked');
      }

      const accessToken = generateAccessToken(recruiter._id as string);
      const refreshToken = generateRefreshToken(recruiter._id as string);

      return { recruiter, accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Failed to log in recruiter: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async updateRecruiter(id: string, recruiterData: Partial<IRecruiter>): Promise<IRecruiter | null> {
    try {
        const updatedRecruiter = await this._recruiterRepository.updateRecruiter(id, recruiterData);
        if (!updatedRecruiter) {
            throw new Error('User not found');
        }

        return updatedRecruiter;
    }catch (error: unknown) {
        console.error("Error updating user:", error);
        throw new Error(`Failed to update user with ID ${id}: ${(error as Error).message}`);
    }
}

  async changeRecruiterPassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const recruiter = await this._recruiterRepository.findById(id);
      console.log("recruiter is : ", recruiter);
      if (!recruiter) {
        console.log("Recruiter not found.");
        throw new Error('Recruiter not found.');
      }

      console.log("current password is : ", currentPassword);
      console.log("recruiter password is : ", recruiter.password);
  
      const isMatch = await bcrypt.compare(currentPassword, recruiter.password);
      if (!isMatch) {
        console.log("Current password is incorrect.");  
        throw new Error('Current password is incorrect.');
      }
  
      const hashedPassword = await hashPassword(newPassword);
      await this._recruiterRepository.updateRecruiterPassword(id, hashedPassword);
    } catch (error) {
      console.error('Error in changeRecruiterPassword service:', error);
      throw new Error(`Failed to change password: ${error instanceof Error ? error.message : String(error)}`);
    }
  }


  async checkMobileExists(mobile: string): Promise<boolean> {
    try {
      const recruiter = await this._recruiterRepository.checkMobileExists(mobile);
      return recruiter;
    } catch (error) {
      console.error('Error in checkEmailExists service:', error);
      throw new Error(`Failed to check email: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
}
