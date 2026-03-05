import { ArtifactsService } from './artifacts.service';
import { createMockHttpService } from '../../test-utils';

describe('ArtifactsService', () => {
  let service: ArtifactsService;
  let http: ReturnType<typeof createMockHttpService>;

  beforeEach(() => {
    http = createMockHttpService();
    service = new ArtifactsService(http as any);
  });

  it('upload creates artifact and fetches redirect url', async () => {
    const artifact = { data: { id: 'art-1' } };
    http.post.mockResolvedValue(artifact);
    http.getRedirectUrl.mockResolvedValue('https://s3.example.com/upload');

    const result = await service.upload({
      releaseId: 'rel-1',
      filename: 'app.zip',
    } as any);

    expect(http.post).toHaveBeenCalledWith('/artifacts', {
      data: {
        type: 'artifacts',
        attributes: { filename: 'app.zip' },
        relationships: {
          release: { data: { type: 'releases', id: 'rel-1' } },
        },
      },
    });
    expect(http.getRedirectUrl).toHaveBeenCalledWith('/artifacts/art-1');
    expect(result).toEqual({
      artifact,
      uploadUrl: 'https://s3.example.com/upload',
    });
  });

  it('getDownloadUrl calls getRedirectUrl', async () => {
    http.getRedirectUrl.mockResolvedValue('https://s3.example.com/download');
    const url = await service.getDownloadUrl('art-1');
    expect(http.getRedirectUrl).toHaveBeenCalledWith('/artifacts/art-1');
    expect(url).toBe('https://s3.example.com/download');
  });

  it('retrieve calls GET /artifacts/:id', async () => {
    http.get.mockResolvedValue({ data: {} });
    await service.retrieve('art-1');
    expect(http.get).toHaveBeenCalledWith('/artifacts/art-1');
  });

  it('update calls PATCH /artifacts/:id', async () => {
    http.patch.mockResolvedValue({ data: {} });
    await service.update('art-1', { filename: 'new.zip' } as any);
    expect(http.patch).toHaveBeenCalledWith('/artifacts/art-1', {
      data: { type: 'artifacts', attributes: { filename: 'new.zip' } },
    });
  });

  it('yank calls DELETE /artifacts/:id', async () => {
    http.delete.mockResolvedValue(undefined);
    await service.yank('art-1');
    expect(http.delete).toHaveBeenCalledWith('/artifacts/art-1');
  });

  it('list calls GET /artifacts', async () => {
    http.get.mockResolvedValue({ data: [] });
    await service.list();
    expect(http.get).toHaveBeenCalledWith('/artifacts', undefined);
  });
});
