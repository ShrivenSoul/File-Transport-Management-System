import {TextEncoder, TextDecoder } from 'util';
import {LandingPage, populateFileSelection} from './LandingPage';
import {S3Client} from '@aws-sdk/client-s3';
import {mockClient} from 'aws-sdk-client-mock';
import { uploadToS3, getDownloadUrl, getFileList } from '../Backend/services/s3';
Object.assign(global, {TextDecoder, TextEncoder});
const s3Mock = mockCLient(S3Client);


beforeEach(() => {
    s3Mock.reset();
})

it('Backend: Test upload functionality', async () => {
    s3Mock.on(PutObjectCommand).resolvesOnce("File Sent");
    const result = await uploadToS3('', '');
    expect(result).toBe("File sent");
});


it("seeing if it works", async () =>{

});