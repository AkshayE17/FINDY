import mongoose from "mongoose";
import { IJobCategoryService } from "../interfaces/jobCategory/IJobCategoryService";
import { IJobCategory } from "../models/JobCatogory";
import { deleteFileFromS3, uploadFileToS3 } from "./s3.service";
import { IJobCategoryRepository } from "../interfaces/jobCategory/IJobCategoryRepository";

export class JobCategoryService implements IJobCategoryService {
  constructor(private _jobCategoryRepository: IJobCategoryRepository) {}

  async createCategory(data: { name: string; description: string; file?: Express.Multer.File }): Promise<IJobCategory> {
    try {
      let imageUrl: string | undefined;
      if (data.file) {
        imageUrl = await uploadFileToS3(data.file);
      }
      const newCategoryData = {
        name: data.name,
        description: data.description,
        imageUrl,
      };
      return await this._jobCategoryRepository.create(newCategoryData);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error('Validation failed. Please check your input data.');
      }

      // Handling duplicate category name (error code 11000 is for duplicate keys)
      if (error instanceof mongoose.Error && (error as any).code === 11000) {
        throw new Error('Category name already exists. Please use a different name.');
      }

      // Handling general errors
      throw new Error(`Failed to create category: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getCategories(page: number, limit: number, searchTerm: string): Promise<{ categories: IJobCategory[]; total: number }> {
    try {
      return await this._jobCategoryRepository.getJobCategories(page, limit, searchTerm);
    } catch (error) {
      throw new Error(`Failed to retrieve categories: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getAllJobCategories(): Promise<IJobCategory[]> {
    try {
      return await this._jobCategoryRepository.getAllJobCategories();
    } catch (error) {
      throw new Error(`Failed to retrieve all categories: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async updateCategory(id: string, data: { name?: string; description?: string; imageUrl?: string }): Promise<IJobCategory | null> {
    try {
      const existingCategory = await this._jobCategoryRepository.findCategoryById(id);
      if (!existingCategory) {
        throw new Error('Category not found');
      }

      const updateData: Partial<IJobCategory> = {
        name: data.name,
        description: data.description,
      };

      if (data.imageUrl && data.imageUrl !== existingCategory.imageUrl) {
        updateData.imageUrl = data.imageUrl;
      }

      return await this._jobCategoryRepository.update(id, updateData);
    } catch (error) {
      throw new Error(`Failed to update category: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findCategoryByName(name: string): Promise<IJobCategory | null> {
    try {
      return await this._jobCategoryRepository.findCategoryByName(name);
    } catch (error) {
      throw new Error(`Failed to find category by name: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async deleteCategory(name: string): Promise<boolean> {
    try {
      return await this._jobCategoryRepository.delete(name);
    } catch (error) {
      throw new Error(`Failed to delete category: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}